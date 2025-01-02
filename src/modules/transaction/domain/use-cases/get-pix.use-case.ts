import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'
import { TransactionDetails } from '@/core/domain/entities/value-objec@core/transaction-details.entity'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

interface GetSaleUseCaseRequest {
    businessId: string;
    pixId: string;
}

type GetSaleUseCaseResponse = Either<
    AppError,
    {
        pix: TransactionDetails;
        message: string;
    }
>;

@Injectable()
export class GetPixUseCase {
    constructor(
        private pixsRepository: TransactionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetSaleUseCaseResponse> {
        const pix = await this.pixsRepository.findByIdDetails(request.pixId, request.businessId);

        if (!pix) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== pix.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            pix,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}