// src/infra/database/redis/repositories/redis-metric-repository.ts
import { Injectable } from '@nestjs/common'
import { RedisBaseRepository } from '@/infra/database/redis/repositories/redis-base-repository'
import { RedisService } from '../redis.service'
import { MetricRepository } from '@/domain/metric/repository/metric-repository'

@Injectable()
export class RedisMetricRepository
    extends RedisBaseRepository
    implements MetricRepository {

    readonly prefix = 'metric'
    private readonly CACHE_TTL = 300 // 5 minutos

    constructor(redisService: RedisService) {
        super(redisService, 'RedisMetricRepository')
    }

    async save({ name, value, metadata }: {
        name: string
        value: number
        metadata?: Record<string, any>
    }): Promise<void> {
        const key = this.getKey(name)
        const data = JSON.stringify({
            value,
            timestamp: Date.now(),
            metadata
        })

        await this.redisService.zadd(key, Date.now(), data)

        // Invalidar cache relacionado
        await this.invalidateMetricCache(name)
    }

    async find({ name, timeRange, metadata }: {
        name: string
        timeRange: { from: Date, to: Date }
        metadata?: Record<string, any>
    }): Promise<Array<{
        value: number,
        timestamp: Date,
        metadata?: Record<string, any>
    }>> {
        const key = this.getKey(name)
        const values = await this.redisService.zrangebyscore(
            key,
            timeRange.from.getTime(),
            timeRange.to.getTime()
        )

        const metrics = values.map(value => {
            const data = JSON.parse(value)
            return {
                value: data.value,
                timestamp: new Date(data.timestamp),
                metadata: data.metadata
            }
        })

        // Filtrar por metadata se especificado
        if (metadata) {
            return metrics.filter(metric =>
                Object.entries(metadata).every(([key, value]) =>
                    metric.metadata?.[key] === value
                )
            )
        }

        return metrics
    }

    async aggregate({ name, timeRange, granularity, metadata }: {
        name: string
        timeRange: { from: Date, to: Date }
        granularity?: 'day' | 'week' | 'month'
        metadata?: Record<string, any>
    }): Promise<{
        sum: number
        avg: number
        min: number
        max: number
        count: number
        timeseries?: Array<{
            timestamp: Date
            value: number
        }>
    }> {
        const cacheKey = this.generateCacheKey('agg', {
            name,
            timeRange,
            granularity,
            metadata
        })

        // Tentar buscar do cache
        const cached = await this.get<any>(cacheKey)
        if (cached) {
            return cached
        }

        const metrics = await this.find({ name, timeRange, metadata })

        if (metrics.length === 0) {
            const emptyResult = {
                sum: 0,
                avg: 0,
                min: 0,
                max: 0,
                count: 0,
                ...(granularity ? { timeseries: [] } : {})
            }
            await this.set(cacheKey, emptyResult, this.CACHE_TTL)
            return emptyResult
        }

        const values = metrics.map(m => m.value)
        const result = {
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
        }

        // Adicionar série temporal se granularidade especificada
        if (granularity) {
            result['timeseries'] = this.generateTimeseries(metrics, granularity)
        }

        // Salvar no cache
        await this.set(cacheKey, result, this.CACHE_TTL)
        return result
    }

    async count({ name, timeRange, metadata }: {
        name: string
        timeRange: { from: Date, to: Date }
        metadata?: Record<string, any>
    }): Promise<number> {
        const metrics = await this.find({ name, timeRange, metadata })
        return metrics.length
    }

    private generateTimeseries(
        metrics: Array<{ value: number, timestamp: Date }>,
        granularity: 'day' | 'week' | 'month'
    ): Array<{ timestamp: Date, value: number }> {
        const grouped = new Map<string, number[]>()

        metrics.forEach(metric => {
            const date = new Date(metric.timestamp)
            let key: string

            switch (granularity) {
                case 'day':
                    key = date.toISOString().split('T')[0]
                    break
                case 'week':
                    const week = this.getWeekNumber(date)
                    key = `${date.getFullYear()}-W${week}`
                    break
                case 'month':
                    key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
                    break
            }

            if (!grouped.has(key)) {
                grouped.set(key, [])
            }
            grouped.get(key)?.push(metric.value)
        })

        return Array.from(grouped.entries())
            .map(([key, values]) => ({
                timestamp: new Date(key),
                value: values.reduce((a, b) => a + b, 0) / values.length
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    }

    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        const dayNum = d.getUTCDay() || 7
        d.setUTCDate(d.getUTCDate() + 4 - dayNum)
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    }

    private generateCacheKey(type: string, params: Record<string, any>): string {
        const sortedParams = Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => {
                if (value instanceof Date) {
                    return `${key}:${value.getTime()}`
                }
                if (typeof value === 'object') {
                    return `${key}:${JSON.stringify(value)}`
                }
                return `${key}:${value}`
            })
            .join(':')

        return `cache:${type}:${sortedParams}`
    }

    private async invalidateMetricCache(metricName: string): Promise<void> {
        const pattern = this.getKey(`cache:*${metricName}*`)
        const keys = await this.redisService.keys(pattern)
        if (keys.length > 0) {
            await this.redisService.del(...keys)
        }
    }
}