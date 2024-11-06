// src/infra/database/redis/repositories/redis-base.repository.ts
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { RedisRepositoryInterface } from '../interfaces/redis-repository-interface';

export abstract class RedisBaseRepository implements RedisRepositoryInterface {
    readonly logger: Logger;
    abstract readonly prefix: string;

    constructor(
        protected readonly redisService: RedisService,
        loggerContext: string
    ) {
        this.logger = new Logger(loggerContext);
    }

    getKey(suffix: string): string {
        const fullKey = `${this.prefix}:${suffix}`;
        return fullKey.replace(/:{2,}/g, ':');
    }

    // Operações Básicas
    async get<T>(key: string): Promise<T | null> {
        const fullKey = this.getKey(key);
        try {
            const value = await this.redisService.get(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.logger.error(`Error getting key ${fullKey}:`, error);
            throw error;
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            const serializedValue = JSON.stringify(value);
            if (ttl) {
                await this.redisService.setex(fullKey, ttl, serializedValue);
            } else {
                await this.redisService.set(fullKey, serializedValue);
            }
        } catch (error) {
            this.logger.error(`Error setting key ${fullKey}:`, error);
            throw error;
        }
    }

    async delete(key: string): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.del(fullKey);
        } catch (error) {
            this.logger.error(`Error deleting key ${fullKey}:`, error);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        const fullKey = this.getKey(key);
        try {
            const result = await this.redisService.exists(fullKey);
            return result === 1;
        } catch (error) {
            this.logger.error(`Error checking existence for key ${fullKey}:`, error);
            throw error;
        }
    }

    // Operações de Lista
    async pushToList<T>(key: string, value: T): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.rpush(fullKey, JSON.stringify(value));
        } catch (error) {
            this.logger.error(`Error pushing to list ${fullKey}:`, error);
            throw error;
        }
    }

    async popFromList<T>(key: string): Promise<T | null> {
        const fullKey = this.getKey(key);
        try {
            const value = await this.redisService.lpop(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.logger.error(`Error popping from list ${fullKey}:`, error);
            throw error;
        }
    }

    async getList<T>(key: string): Promise<T[]> {
        const fullKey = this.getKey(key);
        try {
            const values = await this.redisService.lrange(fullKey, 0, -1);
            return values.map(value => JSON.parse(value));
        } catch (error) {
            this.logger.error(`Error getting list ${fullKey}:`, error);
            throw error;
        }
    }

    async getListLength(key: string): Promise<number> {
        const fullKey = this.getKey(key);
        try {
            return await this.redisService.llen(fullKey);
        } catch (error) {
            this.logger.error(`Error getting list length ${fullKey}:`, error);
            throw error;
        }
    }

    // Operações de Hash
    async hset(key: string, field: string, value: any): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.hset(fullKey, field, JSON.stringify(value));
        } catch (error) {
            this.logger.error(`Error setting hash field ${fullKey}:${field}:`, error);
            throw error;
        }
    }

    async hget<T>(key: string, field: string): Promise<T | null> {
        const fullKey = this.getKey(key);
        try {
            const value = await this.redisService.hget(fullKey, field);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.logger.error(`Error getting hash field ${fullKey}:${field}:`, error);
            throw error;
        }
    }

    async hgetall<T>(key: string): Promise<Record<string, T>> {
        const fullKey = this.getKey(key);
        try {
            const result = await this.redisService.hgetall(fullKey);
            const parsed: Record<string, T> = {};
            for (const [field, value] of Object.entries(result)) {
                parsed[field] = JSON.parse(value);
            }
            return parsed;
        } catch (error) {
            this.logger.error(`Error getting all hash fields ${fullKey}:`, error);
            throw error;
        }
    }

    async hdel(key: string, field: string): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.hdel(fullKey, field);
        } catch (error) {
            this.logger.error(`Error deleting hash field ${fullKey}:${field}:`, error);
            throw error;
        }
    }

    // Operações de Sorted Set
    async zadd(key: string, score: number, value: any): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.zadd(fullKey, score, JSON.stringify(value));
        } catch (error) {
            this.logger.error(`Error adding to sorted set ${fullKey}:`, error);
            throw error;
        }
    }

    async zremrangebyscore(key: string, min: number, max: number): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.zremrangebyscore(fullKey, min, max);
        } catch (error) {
            this.logger.error(`Error removing range from sorted set ${fullKey}:`, error);
            throw error;
        }
    }

    async zcard(key: string): Promise<number> {
        const fullKey = this.getKey(key);
        try {
            return await this.redisService.zcard(fullKey);
        } catch (error) {
            this.logger.error(`Error getting sorted set size ${fullKey}:`, error);
            throw error;
        }
    }

    async zrangebyscore<T>(key: string, min: number, max: number): Promise<T[]> {
        const fullKey = this.getKey(key);
        try {
            const values = await this.redisService.zrangebyscore(fullKey, min, max);
            return values.map(value => JSON.parse(value));
        } catch (error) {
            this.logger.error(`Error getting sorted set range ${fullKey}:`, error);
            throw error;
        }
    }

    // Operações de Lock
    async acquireLock(key: string, ttl: number): Promise<boolean> {
        const fullKey = this.getKey(`lock:${key}`);
        try {
            const acquired = await this.redisService.setnx(fullKey, '1');
            if (acquired === 1) {
                await this.redisService.expire(fullKey, ttl);
                return true;
            }
            return false;
        } catch (error) {
            this.logger.error(`Error acquiring lock ${fullKey}:`, error);
            throw error;
        }
    }

    async releaseLock(key: string): Promise<void> {
        const fullKey = this.getKey(`lock:${key}`);
        try {
            await this.redisService.del(fullKey);
        } catch (error) {
            this.logger.error(`Error releasing lock ${fullKey}:`, error);
            throw error;
        }
    }

    async isLocked(key: string): Promise<boolean> {
        const fullKey = this.getKey(`lock:${key}`);
        return this.exists(fullKey);
    }

    // Operações de Expiração e Limpeza
    async expire(key: string, ttl: number): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.expire(fullKey, ttl);
        } catch (error) {
            this.logger.error(`Error setting expiry for key ${fullKey}:`, error);
            throw error;
        }
    }

    async getKeys(pattern: string): Promise<string[]> {
        const fullPattern = this.getKey(pattern);
        try {
            return await this.redisService.keys(fullPattern);
        } catch (error) {
            this.logger.error(`Error getting keys with pattern ${fullPattern}:`, error);
            throw error;
        }
    }

    async clearAll(): Promise<void> {
        try {
            const pattern = this.getKey('*');
            const keys = await this.redisService.keys(pattern);
            if (keys.length > 0) {
                await this.redisService.del(...keys);
                this.logger.debug(`Cleared ${keys.length} keys with prefix ${this.prefix}`);
            }
        } catch (error) {
            this.logger.error('Error clearing all keys:', error);
            throw error;
        }
    }

    // Utilitários
    protected async multi(): Promise<ReturnType<RedisService['multi']>> {
        return this.redisService.multi();
    }

    protected async watch(key: string): Promise<void> {
        const fullKey = this.getKey(key);
        await this.redisService.watch(fullKey);
    }

    protected async unwatch(): Promise<void> {
        await this.redisService.unwatch();
    }
}