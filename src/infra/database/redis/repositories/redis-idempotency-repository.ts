// src/infra/database/redis/repositories/redis-idempotency.repository.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { BaseRedisRepository } from '../interfaces/redis-repository-interface';

export interface IdempotencyRecord<T = any> {
    result: T;
    timestamp: number;
    processedAt: string;
    metadata?: Record<string, any>;
}

export interface IdempotencyOptions {
    ttl?: number;
    metadata?: Record<string, any>;
    lockTimeout?: number;
}

@Injectable()
export class RedisIdempotencyRepository extends BaseRedisRepository {
    readonly prefix = 'idempotency';
    private readonly defaultTTL = 24 * 60 * 60; // 24 horas em segundos
    private readonly defaultLockTimeout = 30; // 30 segundos para locks

    constructor(redisService: RedisService) {
        super(redisService, 'RedisIdempotencyRepository');
    }

    /**
     * Executa uma operação de forma idempotente
     */
    // src/infra/database/redis/repositories/redis-idempotency.repository.ts

    async processIdempotently<T>(
        key: string,
        operation: () => Promise<T>,
        options: {
            ttl?: number;
            metadata?: Record<string, any>;
        } = {}
    ): Promise<T> {
        const {
            ttl = this.defaultTTL,
            metadata = {}
        } = options;

        // Verificar resultado existente
        const existingResult = await this.getOperationResult<T>(key);
        if (existingResult) {
            this.logger.debug(`Returning cached result for key: ${key}`);
            return existingResult.result;
        }

        // Tentar obter lock
        const lockAcquired = await this.acquireLock(key, this.defaultLockTimeout);
        if (!lockAcquired) {
            throw new Error('Operation in progress');
        }

        try {
            // Executar operação
            const result = await operation();

            // Salvar resultado
            await this.saveOperationResult(key, result, {
                ttl,
                metadata
            });

            return result;
        } finally {
            // Sempre liberar o lock
            await this.releaseLock(key);
        }
    }

    /**
     * Salva o resultado de uma operação
     */
    async saveOperationResult<T>(
        key: string,
        result: T,
        options: {
            ttl?: number;
            metadata?: Record<string, any>;
        } = {}
    ): Promise<void> {
        const { ttl = this.defaultTTL, metadata = {} } = options;

        const record: IdempotencyRecord<T> = {
            result,
            timestamp: Date.now(),
            processedAt: new Date().toISOString(),
            metadata
        };

        await this.set(key, record, ttl);
        this.logger.debug(`Saved result for key: ${key}`);
    }

    /**
     * Obtém o resultado de uma operação
     */
    async getOperationResult<T>(key: string): Promise<IdempotencyRecord<T> | null> {
        try {
            return await this.get<IdempotencyRecord<T>>(key);
        } catch (error) {
            this.logger.error(`Error getting operation result for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Verifica se uma operação já foi processada
     */
    async hasBeenProcessed(key: string): Promise<boolean> {
        return this.exists(key);
    }

    /**
     * Remove o resultado de uma operação
     */
    async removeOperationResult(key: string): Promise<void> {
        await this.delete(key);
        this.logger.debug(`Removed result for key: ${key}`);
    }

    /**
     * Lista todas as operações em progresso
     */
    async listInProgressOperations(): Promise<string[]> {
        const locks = await this.getKeys('lock:*');
        return locks.map(key => key.replace(`${this.prefix}:lock:`, ''));
    }

    /**
     * Obtém métricas de idempotência
     */
    async getMetrics(): Promise<{
        totalProcessed: number;
        inProgress: number;
        averageProcessingTime?: number;
    }> {
        try {
            // Obter todas as chaves exceto locks
            const keys = await this.getKeys('*');
            const records = await Promise.all(
                keys
                    .filter(key => !key.includes('lock:'))
                    .map(key => this.get<IdempotencyRecord>(key))
            );

            const validRecords = records.filter(Boolean);
            const inProgressOps = await this.listInProgressOperations();

            // Calcular tempo médio de processamento
            const processingTimes = validRecords
                .filter(record => record?.metadata?.processingTime)
                .map(record => record?.metadata?.processingTime);

            const averageProcessingTime = processingTimes.length
                ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
                : undefined;

            return {
                totalProcessed: validRecords.length,
                inProgress: inProgressOps.length,
                averageProcessingTime
            };
        } catch (error) {
            this.logger.error('Error getting idempotency metrics:', error);
            throw error;
        }
    }

    /**
     * Limpa operações expiradas
     */
    async cleanup(maxAge: number = this.defaultTTL): Promise<number> {
        try {
            const keys = await this.getKeys('*');
            const now = Date.now();
            let cleaned = 0;

            for (const key of keys) {
                const record = await this.get<IdempotencyRecord>(key);
                if (record && (now - record.timestamp) > maxAge * 1000) {
                    await this.delete(key);
                    cleaned++;
                }
            }

            this.logger.debug(`Cleaned up ${cleaned} expired operations`);
            return cleaned;
        } catch (error) {
            this.logger.error('Error during cleanup:', error);
            throw error;
        }
    }

    /**
     * Programa limpeza periódica
     */
    scheduleCleanup(interval: number = 3600000): void { // 1 hora por padrão
        setInterval(async () => {
            try {
                await this.cleanup();
            } catch (error) {
                this.logger.error('Scheduled cleanup failed:', error);
            }
        }, interval);
    }
}