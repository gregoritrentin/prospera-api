import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { Sale } from '@modul@core/sa@core/entiti@core/sale';
import { SalesRepository } from '@modul@core/sa@core/repositori@core/sales-repository';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

interface GetSaleUseCaseRequest {
    businessId: string;
    saleId: string;
}

type GetSaleUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== sale.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        return right({
            sale,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}