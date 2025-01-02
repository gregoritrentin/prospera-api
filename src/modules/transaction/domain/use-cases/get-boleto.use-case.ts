import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'
import { TransactionDetails } from '@/core/domain/entities/value-objec@core/transaction-details.entity'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

interface GetSaleUseCaseRequest {
    businessId: string;
    boletoId: string;
}

type GetSaleUseCaseResponse = Either<
    AppError,
    {
        boleto: TransactionDetails;
        message: string;
    }
>;

@Injectable()
export class GetBoletoUseCase {
    constructor(
        private boletosRepository: TransactionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetSaleUseCaseResponse> {
        const boleto = await this.boletosRepository.findByIdDetails(request.boletoId, request.businessId);

        if (!boleto) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== boleto.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            boleto,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}