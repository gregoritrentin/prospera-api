// src/infra/database/redis/repositories/redis-config.repository.ts
import { Injectable } from '@nestjs/common';
import { RedisBaseRepository } from './redis-base-repository';
import { RedisService } from '../redis.service';

export interface ConfigEntry<T = any> {
    value: T;
    updatedAt: string;
    updatedBy?: string;
    description?: string;
    metadata?: Record<string, any>;
}

export interface ConfigOptions {
    ttl?: number;
    description?: string;
    metadata?: Record<string, any>;
    updatedBy?: string;
}

@Injectable()
export class RedisConfigRepository extends RedisBaseRepository {
    readonly prefix = 'config';
    private readonly defaultTTL = 0; // 0 = sem expiração por padrão

    constructor(redisService: RedisService) {
        super(redisService, 'RedisConfigRepository');
    }

    /**
     * Define uma configuração
     */
    async setConfig<T>(
        service: string,
        key: string,
        value: T,
        options: ConfigOptions = {}
    ): Promise<void> {
        const {
            ttl = this.defaultTTL,
            description,
            metadata = {},
            updatedBy
        } = options;

        const configEntry: ConfigEntry<T> = {
            value,
            updatedAt: new Date().toISOString(),
            updatedBy,
            description,
            metadata
        };

        const fullKey = `${service}:${key}`;
        await this.set(fullKey, configEntry, ttl);

        this.logger.log(
            `Config set: ${service}:${key}`,
            { value, updatedBy, ttl }
        );
    }

    /**
     * Obtém uma configuração
     */
    async getConfig<T>(
        service: string,
        key: string
    ): Promise<T | null> {
        const fullKey = `${service}:${key}`;
        const entry = await this.get<ConfigEntry<T>>(fullKey);

        return entry?.value ?? null;
    }

    /**
     * Obtém uma configuração com metadados
     */
    async getConfigWithMetadata<T>(
        service: string,
        key: string
    ): Promise<ConfigEntry<T> | null> {
        const fullKey = `${service}:${key}`;
        return this.get<ConfigEntry<T>>(fullKey);
    }

    /**
     * Obtém todas as configurações de um serviço
     */
    async getAllServiceConfigs(
        service: string
    ): Promise<Record<string, ConfigEntry>> {
        const keys = await this.getKeys(`${service}:*`);
        const configs: Record<string, ConfigEntry> = {};

        for (const fullKey of keys) {
            const key = fullKey.split(':').slice(2).join(':');
            const config = await this.get<ConfigEntry>(fullKey);
            if (config) {
                configs[key] = config;
            }
        }

        return configs;
    }

    /**
     * Remove uma configuração
     */
    async removeConfig(
        service: string,
        key: string
    ): Promise<void> {
        const fullKey = `${service}:${key}`;
        await this.delete(fullKey);

        this.logger.log(`Config removed: ${service}:${key}`);
    }

    /**
     * Verifica se uma configuração existe
     */
    async hasConfig(
        service: string,
        key: string
    ): Promise<boolean> {
        const fullKey = `${service}:${key}`;
        return this.exists(fullKey);
    }

    /**
     * Define várias configurações de uma vez
     */
    async setBulkConfig(
        service: string,
        configs: Record<string, any>,
        options: ConfigOptions = {}
    ): Promise<void> {
        const multi = await this.multi();

        for (const [key, value] of Object.entries(configs)) {
            const configEntry: ConfigEntry = {
                value,
                updatedAt: new Date().toISOString(),
                updatedBy: options.updatedBy,
                description: options.description,
                metadata: options.metadata
            };

            const fullKey = this.getKey(`${service}:${key}`);
            multi.set(fullKey, JSON.stringify(configEntry));

            if (options.ttl) {
                multi.expire(fullKey, options.ttl);
            }
        }

        await multi.exec();

        this.logger.log(
            `Bulk config set for service: ${service}`,
            { count: Object.keys(configs).length }
        );
    }

    /**
     * Obtém configurações que correspondem a um padrão
     */
    async searchConfigs(
        pattern: string
    ): Promise<Record<string, ConfigEntry>> {
        const keys = await this.getKeys(pattern);
        const configs: Record<string, ConfigEntry> = {};

        for (const fullKey of keys) {
            const key = fullKey.replace(`${this.prefix}:`, '');
            const config = await this.get<ConfigEntry>(fullKey);
            if (config) {
                configs[key] = config;
            }
        }

        return configs;
    }

    /**
     * Atualiza parcialmente uma configuração existente
     */
    async updateConfig<T>(
        service: string,
        key: string,
        updates: Partial<T>,
        options: ConfigOptions = {}
    ): Promise<void> {
        const fullKey = `${service}:${key}`;
        const existing = await this.get<ConfigEntry<T>>(fullKey);

        if (!existing) {
            throw new Error(`Config not found: ${service}:${key}`);
        }

        const updatedValue = {
            ...existing.value,
            ...updates
        };

        await this.setConfig(
            service,
            key,
            updatedValue,
            {
                ...options,
                description: options.description ?? existing.description,
                metadata: {
                    ...existing.metadata,
                    ...options.metadata
                }
            }
        );
    }

    /**
     * Obtém o histórico de atualizações de uma configuração
     */
    async getConfigHistory(
        service: string,
        key: string,
        limit: number = 10
    ): Promise<ConfigEntry[]> {
        const historyKey = this.getKey(`history:${service}:${key}`);
        return this.getList<ConfigEntry>(historyKey);
    }

    /**
     * Define configurações padrão para um serviço
     */
    async setDefaultConfigs(
        service: string,
        defaults: Record<string, any>
    ): Promise<void> {
        for (const [key, value] of Object.entries(defaults)) {
            const exists = await this.hasConfig(service, key);
            if (!exists) {
                await this.setConfig(service, key, value, {
                    description: 'Default configuration',
                    metadata: { isDefault: true }
                });
            }
        }
    }

    /**
     * Limpa todas as configurações de um serviço
     */
    async clearServiceConfigs(service: string): Promise<void> {
        const keys = await this.getKeys(`${service}:*`);
        if (keys.length > 0) {
            await this.redisService.del(...keys);
        }

        this.logger.log(
            `Cleared all configs for service: ${service}`,
            { count: keys.length }
        );
    }
}