// src/domain/metrics/cache/transaction-metrics-cache.ts
import { Injectable } from '@nestjs/common'
import { RedisService } from '@/infra/database/redis/redis.service'

interface CacheConfig {
    ttl: number
    prefix: string
}

@Injectable()
export class TransactionMetricsCache {
    private config: CacheConfig = {
        ttl: 60 * 5, // 5 minutos
        prefix: 'metrics:transaction'
    }

    constructor(private redisService: RedisService) { }

    private generateKey(params: Record<string, any>): string {
        const sortedParams = Object.entries(params)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}:${value}`)
            .join(':')
        return `${this.config.prefix}:${sortedParams}`
    }

    async get<T>(params: Record<string, any>): Promise<T | null> {
        const key = this.generateKey(params)
        const cached = await this.redisService.get(key)
        return cached ? JSON.parse(cached) : null
    }

    async set<T>(params: Record<string, any>, data: T): Promise<void> {
        const key = this.generateKey(params)
        await this.redisService.setex(key, this.config.ttl, JSON.stringify(data))
    }

    async invalidate(params: Record<string, any>): Promise<void> {
        const key = this.generateKey(params)
        await this.redisService.del(key)
    }

    async invalidatePattern(pattern: string): Promise<void> {
        const keys = await this.redisService.keys(`${this.config.prefix}:${pattern}*`)
        if (keys.length > 0) {
            await this.redisService.del(...keys)
        }
    }
}