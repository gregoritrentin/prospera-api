import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { BoletoRepository } from '@/domain/transaction/repositories/boleto-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { BoletoDetails } from '../entities/value-objects/boleto-details';
import { AppError } from '@/core/errors/app-errors';

interface GetSaleUseCaseRequest {
    businessId: string;
    boletoId: string;
}

type GetSaleUseCaseResponse = Either<
    AppError,
    {
        boleto: BoletoDetails;
        message: string;
    }
>;

@Injectable()
export class GetBoletoUseCase {
    constructor(
        private boletosRepository: BoletoRepository,
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