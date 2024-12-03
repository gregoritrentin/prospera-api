import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { BaseRedisRepository } from '../interfaces/redis-repository-interface';

export interface RateLimitConfig {
    points: number;        // Número máximo de requisições
    duration: number;      // Período em segundos
    blockDuration?: number; // Duração do bloqueio em segundos
}

export interface RateLimitInfo {
    allowed: boolean;
    remaining: number;     // Requisições restantes
    total: number;        // Total de requisições permitidas
    resetTime: number;    // Timestamp de reset
    blocked: boolean;     // Se está bloqueado
    retryAfter?: number;  // Segundos até poder tentar novamente
}

@Injectable()
export class RedisRateLimitRepository extends BaseRedisRepository {
    readonly prefix = 'rate-limit';

    // Configurações padrão por serviço
    private readonly defaultConfigs: Record<string, RateLimitConfig> = {
        'invoice': { points: 1000, duration: 60 },    // 1000 req/min
        'boleto': { points: 100, duration: 60 },      // 100 req/min
        'nfse': { points: 20, duration: 60 },         // 20 req/min
        'whatsapp': { points: 30, duration: 60 },     // 30 req/min
        'email': { points: 50, duration: 60 },        // 50 req/min
        'subscription-invoice': { points: 60, duration: 60 } // 60 req/min (1 por segundo)
    };

    constructor(redisService: RedisService) {
        super(redisService, 'RedisRateLimitRepository');
    }

    /**
     * Verifica e incrementa o rate limit
     */
    async checkAndIncrement(
        service: string,
        identifier: string,
        cost: number = 1
    ): Promise<RateLimitInfo> {
        const config = await this.getServiceConfig(service);
        if (!config) {
            throw new Error(`No rate limit config found for service: ${service}`);
        }

        const key = this.getKey(`${service}:${identifier}`);
        const blockKey = this.getKey(`block:${service}:${identifier}`);
        const now = Math.floor(Date.now() / 1000);

        // Verificar se está bloqueado
        const isBlocked = await this.get(blockKey);
        if (isBlocked) {
            const ttl = await this.redisService.ttl(blockKey);
            return {
                allowed: false,
                remaining: 0,
                total: config.points,
                resetTime: now + ttl,
                blocked: true,
                retryAfter: ttl
            };
        }

        // Usar transação Redis para garantir atomicidade
        const multi = this.redisService.multi();

        if (config.duration) {
            // Remover tokens expirados
            multi.zremrangebyscore(key, 0, now - config.duration);
        }

        // Adicionar novos tokens
        for (let i = 0; i < cost; i++) {
            multi.zadd(key, now, `${now}-${Math.random()}`);
        }

        // Definir TTL
        multi.expire(key, config.duration);

        // Contar tokens atuais
        multi.zcard(key);

        const results = await multi.exec();
        if (!results) {
            throw new Error('Failed to execute Redis transaction');
        }
        const currentUsage = (results[results.length - 1][1] as number);

        // Verificar se excedeu o limite
        if (currentUsage > config.points) {
            // Bloquear se configurado
            if (config.blockDuration) {
                await this.set(
                    blockKey,
                    { blockedAt: now },
                    config.blockDuration
                );

                return {
                    allowed: false,
                    remaining: 0,
                    total: config.points,
                    resetTime: now + config.blockDuration,
                    blocked: true,
                    retryAfter: config.blockDuration
                };
            }
        }

        const resetTime = now + config.duration;
        const remaining = Math.max(config.points - currentUsage, 0);

        return {
            allowed: currentUsage <= config.points,
            remaining,
            total: config.points,
            resetTime,
            blocked: false
        };
    }

    /**
     * Obtém a configuração do rate limit para um serviço
     */
    async getServiceConfig(service: string): Promise<RateLimitConfig | null> {
        const configKey = this.getKey(`config:${service}`);
        const customConfig = await this.get<RateLimitConfig>(configKey);

        return customConfig || this.defaultConfigs[service] || null;
    }

    /**
     * Define uma configuração customizada para um serviço
     */
    async setServiceConfig(
        service: string,
        config: RateLimitConfig
    ): Promise<void> {
        const configKey = this.getKey(`config:${service}`);
        await this.set(configKey, config);

        this.logger.log(`Updated rate limit config for ${service}:`, config);
    }

    /**
     * Remove o bloqueio de um identificador
     */
    async unblock(service: string, identifier: string): Promise<void> {
        const blockKey = this.getKey(`block:${service}:${identifier}`);
        await this.delete(blockKey);

        this.logger.log(`Unblocked ${service}:${identifier}`);
    }

    /**
     * Obtém informações de uso atual
     */
    async getCurrentUsage(
        service: string,
        identifier: string
    ): Promise<RateLimitInfo> {
        const config = await this.getServiceConfig(service);
        if (!config) {
            throw new Error(`No rate limit config found for service: ${service}`);
        }

        const key = this.getKey(`${service}:${identifier}`);
        const blockKey = this.getKey(`block:${service}:${identifier}`);
        const now = Math.floor(Date.now() / 1000);

        // Verificar bloqueio
        const isBlocked = await this.exists(blockKey);
        if (isBlocked) {
            const ttl = await this.redisService.ttl(blockKey);
            return {
                allowed: false,
                remaining: 0,
                total: config.points,
                resetTime: now + ttl,
                blocked: true,
                retryAfter: ttl
            };
        }

        // Limpar tokens expirados e contar atuais
        await this.zremrangebyscore(key, 0, now - config.duration);
        const currentUsage = await this.zcard(key);

        return {
            allowed: currentUsage <= config.points,
            remaining: Math.max(config.points - currentUsage, 0),
            total: config.points,
            resetTime: now + config.duration,
            blocked: false
        };
    }

    /**
     * Reseta o contador para um identificador
     */
    async reset(service: string, identifier: string): Promise<void> {
        const key = this.getKey(`${service}:${identifier}`);
        const blockKey = this.getKey(`block:${service}:${identifier}`);

        await Promise.all([
            this.delete(key),
            this.delete(blockKey)
        ]);

        this.logger.log(`Reset rate limit for ${service}:${identifier}`);
    }

    /**
     * Obtém métricas de rate limiting
     */
    async getMetrics(service: string): Promise<{
        totalBlocked: number;
        currentlyBlocked: number;
        topConsumers: Array<{ identifier: string; usage: number }>;
    }> {
        const pattern = `${service}:*`;
        const blockPattern = `block:${service}:*`;

        const [keys, blockedKeys] = await Promise.all([
            this.getKeys(pattern),
            this.getKeys(blockPattern)
        ]);

        // Calcular uso para cada identificador
        const usagePromises = keys
            .filter(key => !key.includes('block:') && !key.includes('config:'))
            .map(async key => {
                const identifier = key.split(':').pop() || '';
                const usage = await this.zcard(key);
                return { identifier, usage };
            });

        const usages = await Promise.all(usagePromises);

        // Ordenar por uso
        const topConsumers = usages
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 10);

        return {
            totalBlocked: blockedKeys.length,
            currentlyBlocked: blockedKeys.length,
            topConsumers
        };
    }

    /**
     * Agenda uma limpeza periódica de tokens expirados
     */
    async scheduleCleanup(interval: number = 60000): Promise<void> {
        setInterval(async () => {
            try {
                const keys = await this.getKeys('*');
                const now = Math.floor(Date.now() / 1000);

                for (const key of keys) {
                    if (key.includes('config:')) continue;

                    await this.zremrangebyscore(key, 0, now - 3600);
                }

                this.logger.debug('Completed rate limit cleanup');
            } catch (error) {
                this.logger.error('Error during rate limit cleanup:', error);
            }
        }, interval);
    }

    /**
     * Obtém o status do rate limit para diagnóstico
     */
    async getDiagnostics(service: string, identifier: string): Promise<{
        config: RateLimitConfig | null;
        currentUsage: number;
        isBlocked: boolean;
        ttl: number;
        tokens: Array<{ timestamp: number; id: string }>;
    }> {
        const config = await this.getServiceConfig(service);
        const key = this.getKey(`${service}:${identifier}`);
        const blockKey = this.getKey(`block:${service}:${identifier}`);

        const [currentUsage, isBlocked, ttl, tokens] = await Promise.all([
            this.zcard(key),
            this.exists(blockKey),
            this.redisService.ttl(key),
            this.zrange(key, 0, -1, 'WITHSCORES')
        ]);

        const tokenList = tokens.map((token, index) => ({
            timestamp: parseInt(tokens[index + 1]),
            id: token
        })).filter((_, index) => index % 2 === 0);

        return {
            config,
            currentUsage,
            isBlocked,
            ttl,
            tokens: tokenList
        };
    }
    zrange(key: string, arg1: number, arg2: number, arg3: string): any {
        throw new Error('Method not implemented.');
    }
}