// src/infra/database/redis/interfaces/redis-repository.interface.ts
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis.service';

/**
 * Interface principal para operações Redis
 */
export interface RedisRepositoryInterface {
    readonly prefix: string;
    readonly logger: Logger;

    // Métodos base
    getKey(suffix: string): string;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;

    // Métodos de gerenciamento
    expire(key: string, ttl: number): Promise<void>;
    clearAll(): Promise<void>;
    getKeys(pattern: string): Promise<string[]>;

    // Métodos de lista
    pushToList<T>(key: string, value: T): Promise<void>;
    popFromList<T>(key: string): Promise<T | null>;
    getList<T>(key: string): Promise<T[]>;
    getListLength(key: string): Promise<number>;

    // Métodos de hash
    hset(key: string, field: string, value: any): Promise<void>;
    hget<T>(key: string, field: string): Promise<T | null>;
    hgetall<T>(key: string): Promise<Record<string, T>>;
    hdel(key: string, field: string): Promise<void>;

    // Métodos de sorted set
    zadd(key: string, score: number, value: any): Promise<void>;
    zremrangebyscore(key: string, min: number, max: number): Promise<void>;
    zcard(key: string): Promise<number>;
    zrangebyscore<T>(key: string, min: number, max: number): Promise<T[]>;

    // Métodos de lock
    acquireLock(key: string, ttl: number): Promise<boolean>;
    releaseLock(key: string): Promise<void>;
    isLocked(key: string): Promise<boolean>;
}

/**
 * Classe base para implementações de Redis Repository
 */
export abstract class BaseRedisRepository implements RedisRepositoryInterface {
    readonly logger: Logger;
    abstract readonly prefix: string;

    constructor(
        protected readonly redisService: RedisService,
        loggerContext: string
    ) {
        this.logger = new Logger(loggerContext);
    }

    // Implementação dos métodos base
    getKey(suffix: string): string {
        return `${this.prefix}:${suffix}`;
    }

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
            if (ttl) {
                await this.redisService.setex(fullKey, ttl, JSON.stringify(value));
            } else {
                await this.redisService.set(fullKey, JSON.stringify(value));
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

    // Implementação dos métodos de gerenciamento
    async expire(key: string, ttl: number): Promise<void> {
        const fullKey = this.getKey(key);
        try {
            await this.redisService.expire(fullKey, ttl);
        } catch (error) {
            this.logger.error(`Error setting expiry for key ${fullKey}:`, error);
            throw error;
        }
    }

    async clearAll(): Promise<void> {
        try {
            const pattern = this.getKey('*');
            const keys = await this.redisService.keys(pattern);
            if (keys.length > 0) {
                await this.redisService.del(...keys);
            }
        } catch (error) {
            this.logger.error('Error clearing all keys:', error);
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

    // Implementação dos métodos de lista
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

    // Implementação dos métodos de hash
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

    // Implementação dos métodos de sorted set
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
            this.logger.error(`Error removing from sorted set ${fullKey}:`, error);
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

    // Implementação dos métodos de lock
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
        try {
            return await this.exists(fullKey);
        } catch (error) {
            this.logger.error(`Error checking lock ${fullKey}:`, error);
            throw error;
        }
    }
}