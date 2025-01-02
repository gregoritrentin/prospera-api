import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { TwoFactorAutentication } from '@/modules/application/domain/entities/two-factor-autentication'
import { TwoFactorAutenticationRepository } from '@/modules/application/domain/repositories/two-factor-autentication'
import { TwoFactorType } from '@/core/utils/enums'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { AppError } from '@/core/error/app-errors'

interface VerifyTwoFactorAutenticationRequest {
    userId: string
    type: TwoFactorType
    code: string
}

type VerifyTwoFactorAutenticationResponse = Either<
    AppError,
    {
        twoFactor: TwoFactorAutentication
    }
>

@Injectable()
export class VerifyTwoFactorAutenticationUseCase {
    constructor(
        private twoFactorAutenticationRepository: TwoFactorAutenticationRepository,
    ) { }

    async execute({
        userId,
        type,
        code,
    }: VerifyTwoFactorAutenticationRequest): Promise<VerifyTwoFactorAutenticationResponse> {
        try {
            const twoFactor = await this.twoFactorAutenticationRepository
                .findActiveByUserAndType(new UniqueEntityID(userId), type)

            if (!twoFactor) {
                return left(AppError.twoFactorNotFound())
            }

            if (twoFactor.verified) {
                return left(AppError.twoFactorAlreadyVerified())
            }

            if (twoFactor.expiresAt < new Date()) {
                return left(AppError.twoFactorExpired())
            }

            if (twoFactor.attempts >= 3) {
                return left(AppError.twoFactorMaxAttempts())
            }

            if (twoFactor.code !== code) {
                twoFactor.incrementAttempts()
                await this.twoFactorAutenticationRepository.save(twoFactor)
                return left(AppError.twoFactorInvalidCode())
            }

            twoFactor.verify()
            await this.twoFactorAutenticationRepository.save(twoFactor)

            return right({
                twoFactor
            })
        } catch (error) {
            return left(AppError.twoFactorVerificationFailed())
        }
    }
}