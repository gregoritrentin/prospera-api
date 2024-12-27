// src/domain/nfse/use-cases/delete-nfse.use-case.ts
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { AppError } from '@core/error/app-errors'
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository'
import { NfseStatus } from '@core/utils/enums'

interface DeleteNfseUseCaseRequest {
    businessId: string
    nfseId: string
}

type DeleteNfseUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteNfseUseCase {
    constructor(private nfseRepository: NfseRepository) { }

    async execute({
        businessId,
        nfseId,
    }: DeleteNfseUseCaseRequest): Promise<DeleteNfseUseCaseResponse> {
        const nfse = await this.nfseRepository.findById(nfseId, businessId)

        if (!nfse) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== nfse.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        // Validação de status para exclusão
        const deletableStatus = [
            NfseStatus.DRAFT,
            NfseStatus.ERROR,
            NfseStatus.REJECTED
        ]

        if (!deletableStatus.includes(nfse.status)) {
            return left(
                AppError.notAllowed(
                    'errors.CANNOT_DELETE_NFSE_WITH_STATUS',
                    { status: nfse.status }
                )
            )
        }

        await this.nfseRepository.delete(nfse)

        return right(null)
    }
}