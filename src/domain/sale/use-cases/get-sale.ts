import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Sale } from '@/domain/sale/entities/sale';
import { SalesRepository } from '@/domain/sale/repositories/sales-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { SaleValidationError } from '@/domain/sale/errors/sale-validation-error';

interface GetSaleUseCaseRequest {
    businessId: string;
    saleId: string;
}

type GetSaleUseCaseResponse = Either<
    SaleValidationError,
    {
        sale: Sale;
        message: string;
    }
>;

@Injectable()
export class GetSaleUseCase {
    constructor(
        private salesRepository: SalesRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetSaleUseCaseResponse> {
        const sale = await this.salesRepository.findById(request.saleId, request.businessId);

        if (!sale) {
            return left(SaleValidationError.resourceNotFound());
        }

        if (request.businessId !== sale.businessId.toString()) {
            return left(SaleValidationError.notAllowed());
        }

        return right({
            sale,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}