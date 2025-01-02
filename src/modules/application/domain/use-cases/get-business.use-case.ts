import { Either, right, left } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { Business } from '@/modules/application/domain/entities/business'
import { BusinessRepository } from '@/modules/application/domain/repositories/business-repository'
import { Injectable, Logger } from '@nestjs/common'
import { Account } from '@/modules/account/domain/entities/account'
import { AccountsRepository } from '@/modules/account/domain/repositories/account-repository'

interface GetBusinessUseCaseRequest {
    businessId: string
}

interface BusinessWithAccount extends Business {
    account?: Account
}

interface GetBusinessUseCaseResponse {
    business: BusinessWithAccount[]
}

type GetBusinessResult = Either<AppError, GetBusinessUseCaseResponse>

@Injectable()
export class GetBusinessUseCase {
    private readonly logger = new Logger(GetBusinessUseCase.name)

    constructor(
        private businessRepository: BusinessRepository,
        private accountsRepository: AccountsRepository
    ) { }

    async execute({
        businessId,
    }: GetBusinessUseCaseRequest): Promise<GetBusinessResult> {
        try {
            this.logger.debug('=== Starting GetBusinessUseCase ===')
            this.logger.debug('Input:', { businessId })

            // 1. Buscar informações do negócio
            const businesses = await this.businessRepository.findMe(businessId)
            if (!businesses || businesses.length === 0) {
                this.logger.debug('Business not found')
                return left(AppError.resourceNotFound('errors.BUSINESS_NOT_FOUND'))
            }

            // 2. Para cada negócio, buscar sua conta
            const businessesWithAccounts = await Promise.all(
                businesses.map(async (business) => {
                    const account = await this.accountsRepository.findByBusinessId(business.id.toString())
                    return {
                        ...(business as Business),
                        account: account || undefined
                    } as BusinessWithAccount
                })
            )

            this.logger.debug('=== GetBusinessUseCase completed successfully ===')

            return right({
                business: businessesWithAccounts,
            })
        } catch (error) {
            this.logger.error('=== Error in GetBusinessUseCase ===')
            this.logger.error('Error details:', error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : String(error))

            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'))
        }
    }
}