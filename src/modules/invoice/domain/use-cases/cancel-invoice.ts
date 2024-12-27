import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { InvoiceRepository } from '@modul@core/invoi@core/respositori@core/invoice-repository';
import { AppError } from @core/co@core/erro@core/app-errors';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { InvoiceStatus } from @core/co@core/typ@core/enums';

interface CancelInvoiceUseCaseRequest {
    businessId: string;
    invoiceId: string;
    language?: Language;
}

type CancelInvoiceUseCaseResponse = Either<
    AppError,
    { message: string }
>

@Injectable()
export class CancelInvoiceUseCase {
    constructor(

        private invoiceRepository: InvoiceRepository,
        private i18n: I18nService
    ) { }

    async execute({
        businessId,
        invoiceId,
        language,
    }: CancelInvoiceUseCaseRequest): Promise<CancelInvoiceUseCaseResponse> {
        const invoice = await this.invoiceRepository.findById(invoiceId, businessId);

        if (!invoice) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
        }

        if (invoice.status === 'CANCELED' || invoice.status === 'PAID') {
            return left(AppError.invoiceCancelationFailed({ message: 'errors.INVOICE_CANCELATION_FAILED' }));
        }

        try {

            invoice.status = InvoiceStatus.CANCELED;

            await this.invoiceRepository.save(invoice);

            const message = this.i18n.translate('messages.RECORD_UPDATED', language);
            return right({ message });

        } catch (error) {
            console.error('Erro ao cancelar invoice:', error);
            const errorMessage = this.i18n.translate('errors.SICREDI_ERROR_FULL', language, {
                action: 'cancelar',
                errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
            });
            return left(AppError.invoiceCancelationFailed({ message: errorMessage }));
        }
    }
}