import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { Invoice } from '@modul@core/invoi@core/entiti@core/invoice';
import { InvoiceRepository } from '@modul@core/invoi@core/respositori@core/invoice-repository'
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

interface GetInvoiceUseCaseRequest {
    businessId: string;
    invoiceId: string;
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
        request: GetInvoiceUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetInvoiceUseCaseResponse> {
        const invoice = await this.invoiceRepository.findById(request.invoiceId, request.businessId);

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