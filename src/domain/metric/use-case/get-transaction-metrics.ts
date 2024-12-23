// src/domain/metrics/use-cases/get-transaction-metrics.ts
import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { MetricRepository } from '@/domain/metric/repository/metric-repository'
import { AppError, ErrorCode } from '@/core/errors/app-errors'

interface GetTransactionMetricsRequest {
    businessId: string
    timeRange: {
        from: Date
        to: Date
    }
    granularity?: 'day' | 'week' | 'month'
    type?: 'PIX' | 'BOLETO' | 'CARD'
    status?: 'SUCCESS' | 'FAILURE' | 'PENDING'
}

interface MetricAggregation {
    sum: number
    avg: number
    min: number
    max: number
    count: number
    timeseries?: Array<{
        timestamp: Date
        value: number
    }>
}

interface TransactionTypeMetrics {
    count: MetricAggregation
    amount: MetricAggregation
    successRate: number
}

interface TotalMetrics {
    count: number
    amount: number
    avgTicket: number
    successRate: number
}

interface TransactionMetrics {
    pix?: TransactionTypeMetrics
    boleto?: TransactionTypeMetrics
    card?: TransactionTypeMetrics
    total: TotalMetrics
}

type GetTransactionMetricsResponse = Either<
    AppError,
    TransactionMetrics
>

@Injectable()
export class GetTransactionMetricsUseCase {
    constructor(
        private metricRepository: MetricRepository
    ) { }

    private validateInput(input: GetTransactionMetricsRequest): Either<AppError, true> {
        if (!input.businessId?.trim()) {
            return left(new AppError(
                ErrorCode.VALIDATION_ERROR,
                'errors.INVALID_BUSINESS_ID',
                { businessId: input.businessId }
            ))
        }

        if (input.type && !['PIX', 'BOLETO', 'CARD'].includes(input.type)) {
            return left(new AppError(
                ErrorCode.VALIDATION_ERROR,
                'errors.INVALID_TRANSACTION_TYPE',
                { type: input.type }
            ))
        }

        if (input.status && !['SUCCESS', 'FAILURE', 'PENDING'].includes(input.status)) {
            return left(new AppError(
                ErrorCode.VALIDATION_ERROR,
                'errors.INVALID_STATUS',
                { status: input.status }
            ))
        }

        if (input.timeRange.from > input.timeRange.to) {
            return left(new AppError(
                ErrorCode.VALIDATION_ERROR,
                'errors.INVALID_TIME_RANGE',
                { from: input.timeRange.from, to: input.timeRange.to }
            ))
        }

        return right(true)
    }

    private async getTypeMetrics(
        businessId: string,
        type: string,
        timeRange: { from: Date, to: Date },
        granularity?: 'day' | 'week' | 'month',
        status?: string
    ): Promise<TransactionTypeMetrics> {
        const baseMetricName = `transactions.${businessId}.${type.toLowerCase()}`
        const metadata = status ? { status } : undefined

        // Buscar agregações com granularidade se especificada
        const [count, amount] = await Promise.all([
            this.metricRepository.aggregate({
                name: `${baseMetricName}.count`,
                timeRange,
                granularity,
                metadata
            }),
            this.metricRepository.aggregate({
                name: `${baseMetricName}.amount`,
                timeRange,
                granularity,
                metadata
            })
        ])

        // Calcular taxa de sucesso usando count otimizado
        const [successCount, totalCount] = await Promise.all([
            this.metricRepository.count({
                name: `${baseMetricName}.count`,
                timeRange,
                metadata: { status: 'SUCCESS' }
            }),
            this.metricRepository.count({
                name: `${baseMetricName}.count`,
                timeRange
            })
        ])

        const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0

        return {
            count,
            amount,
            successRate
        }
    }

    async execute({
        businessId,
        timeRange,
        granularity,
        type,
        status
    }: GetTransactionMetricsRequest): Promise<GetTransactionMetricsResponse> {
        const validationResult = this.validateInput({
            businessId,
            timeRange,
            granularity,
            type,
            status
        })

        if (validationResult.isLeft()) {
            return left(validationResult.value)
        }

        try {
            const metrics: TransactionMetrics = {
                total: {
                    count: 0,
                    amount: 0,
                    avgTicket: 0,
                    successRate: 0
                }
            }

            const types = type ? [type] : ['PIX', 'BOLETO', 'CARD']

            // Buscar métricas para cada tipo em paralelo
            const typeMetrics = await Promise.all(
                types.map(async t => ({
                    type: t.toLowerCase() as keyof Omit<TransactionMetrics, 'total'>,
                    metrics: await this.getTypeMetrics(
                        businessId,
                        t,
                        timeRange,
                        granularity,
                        status
                    )
                }))
            )

            // Processar resultados
            typeMetrics.forEach(({ type, metrics: typeMetric }) => {
                // Atribuir métricas do tipo específico
                metrics[type] = typeMetric

                // Acumular totais
                metrics.total.count += typeMetric.count.sum
                metrics.total.amount += typeMetric.amount.sum
            })

            // Calcular médias totais
            if (metrics.total.count > 0) {
                metrics.total.avgTicket = metrics.total.amount / metrics.total.count
                metrics.total.successRate = typeMetrics.reduce(
                    (acc, { metrics: m }) => acc + m.successRate,
                    0
                ) / typeMetrics.length
            }

            return right(metrics)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            return left(new AppError(
                ErrorCode.INTERNAL_SERVER_ERROR,
                'errors.METRICS_CALCULATION_FAILED',
                { error: errorMessage }
            ))
        }
    }
}