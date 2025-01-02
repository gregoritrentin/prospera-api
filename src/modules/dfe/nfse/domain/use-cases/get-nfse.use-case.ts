import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Nfse } from '@/modules//domain/dfe/nfse/entities/nfse'
import { NfseRepository } from '@/modules/dfe/domain/nfse/repositories/nfse-repository'
import { I18nService, Language } from '@/i18n/i18n.service'
import { AppError } from '@/core/error/app-errors'

// src/domain/nfse/use-cases/get-nfse.use-case.ts
interface GetNfseUseCaseRequest {
    businessId: string;
    nfseId: string;
}

type GetNfseUseCaseResponse = Either<
    AppError,
    {
        nfse: Nfse;
        message: string;
    }
>;

@Injectable()
export class GetNfseUseCase {
    constructor(
        private nfseRepository: NfseRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetNfseUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetNfseUseCaseResponse> {
        const nfse = await this.nfseRepository.findById(request.nfseId, request.businessId);

        if (!nfse) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
        }

        if (request.businessId !== nfse.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            nfse,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}