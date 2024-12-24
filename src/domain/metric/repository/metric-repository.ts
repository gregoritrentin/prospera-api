// src/domain/metric/repository/metric-repository.ts


export abstract class MetricRepository {
    abstract save(params: { name: string; value: number; metadata?: Record<string, any> }): Promise<void>
    abstract find(params: { name: string; timeRange: { from: Date; to: Date }; metadata?: Record<string, any> }): Promise<Array<{ value: number; timestamp: Date; metadata?: Record<string, any> }>>
    abstract aggregate(params: { name: string; timeRange: { from: Date; to: Date }; granularity?: 'day' | 'week' | 'month'; metadata?: Record<string, any> }): Promise<{ sum: number; avg: number; min: number; max: number; count: number; timeseries?: Array<{ timestamp: Date; value: number }> }>
    abstract count(params: { name: string; timeRange: { from: Date; to: Date }; metadata?: Record<string, any> }): Promise<number>
}
