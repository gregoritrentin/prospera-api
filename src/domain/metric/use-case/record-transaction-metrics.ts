import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { MetricRepository } from '@/domain/metric/repository/metric-repository'
import { AppError } from '@/core/errors/app-errors'
import { MetricType, TransactionStatus } from '@/core/types/enums'

interface RecordTransactionMetricRequest {
    businessId: string
    type: MetricType
    amount: number
    status: TransactionStatus | 'PENDING' | 'PAID' | 'CANCELLED'
}

type RecordTransactionMetricResponse = Either<AppError, void>

@Injectable()
export class RecordTransactionMetricUseCase {
    constructor(private metricRepository: MetricRepository) { }

    async execute({
        businessId,
        type,
        amount,
        status
    }: RecordTransactionMetricRequest): Promise<RecordTransactionMetricResponse> {
        try {
            // Registrar contagem de transações
            await this.metricRepository.save({
                name: `transactions.${businessId}.${type.toLowerCase()}.count`,
                value: 1,
                metadata: { status }
            })

            // Registrar valor das transações
            await this.metricRepository.save({
                name: `transactions.${businessId}.${type.toLowerCase()}.amount`,
                value: amount,
                metadata: { status }
            })

            return right(undefined)
        } catch (error) {
            return left(AppError.internalServerError('errors.METRIC_RECORDING_FAILED'))
        }
    }
}