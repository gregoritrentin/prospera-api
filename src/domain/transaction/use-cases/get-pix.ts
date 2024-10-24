import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { TransactionDetails } from '../entities/value-objects/transaction-details';
import { AppError } from '@/core/errors/app-errors';

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