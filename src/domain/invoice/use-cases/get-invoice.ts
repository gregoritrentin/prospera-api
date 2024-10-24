import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Invoice } from '@/domain/invoice/entities/invoice';
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository'
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';

interface GetSaleUseCaseRequest {
    businessId: string;
    saleId: string;
}

type GetInvoiceUseCaseResponse = Either<
    AppError,
    {
        invoice: Invoice;
        message: string;
    }
>;

@Injectable()
export class GetInvoiceUseCase {
    constructor(
        private invoiceRepository: InvoiceRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetInvoiceUseCaseResponse> {
        const invoice = await this.invoiceRepository.findById(request.saleId, request.businessId);

        if (!invoice) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== invoice.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            invoice,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}