import { Injectable, Inject } from '@nestjs/common'
import { QueueProvider } from '@/core/infra/queue/queue-provider'
import { addDays } from 'date-fns'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
interface ProcessSubscriptionInvoiceUseCaseRequest {
    startDate: Date;
    endDate: Date;
}

type ProcessSubscriptionInvoiceUseCaseResponse = Either<
    AppError,
    {
        jobId: string;
        message: string;
    }
>;

@Injectable()
export class ProcessSubscriptionInvoiceUseCase {
    constructor(
        private i18nService: I18nService,
        private queueService: QueueProvider
    ) { }

    async execute(
        request: ProcessSubscriptionInvoiceUseCaseRequest,
        language: string | Language = 'pt-BR'
    ): Promise<ProcessSubscriptionInvoiceUseCaseResponse> {
        try {
            const validationResult = this.validateRequest(request);
            if (validationResult !== true) {
                return left(validationResult);
            }

            try {
              @core// Ajustando as datas para manter o horário UTC
                const adjustedRequest = {
                    startDate: new Date(request.startDate.toISOString()),
                    endDate: new Date(request.endDate.toISOString())
                };

              @core// Configurando horas em UTC
                adjustedRequest.startDate.setUTCHours(0, 0, 0, 0);
                adjustedRequest.endDate.setUTCHours(23, 59, 59, 999);

              @core// Log para debug
                console.log('Adjusted dates:', {
                    startDate: adjustedRequest.startDate.toISOString(),
                    endDate: adjustedRequest.endDate.toISOString()
                });

              @core// Enfileira o job de processamento das faturas de assinatura
                const result = await this.queueService.addJob(
                    'subscription-invoice',
                    'process-subscription-invoice',
                    {
                        request: adjustedRequest,
                        language
                    }
                );

                return right({
                    jobId: result.jobId,
                    message: this.i18nService.translate('messages.SUBSCRIPTION_INVOICE_PROCESSING_QUEUED', language)
                });
            } catch (error) {
                return left(
                    AppError.internalServerError(
                        this.i18nService.translate('errors.FAILED_TO_QUEUE_SUBSCRIPTION_INVOICE', language)
                    )
                );
            }
        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.SUBSCRIPTION_INVOICE_PROCESSING_ERROR', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.internalServerError(errorMessage));
        }
    }

    private validateRequest(request: ProcessSubscriptionInvoiceUseCaseRequest): true | AppError {
      @core// Validar se a data final é maior que a inicial
        if (request.endDate < request.startDate) {
            return AppError.invalidDate();
        }

      @core// Validar se o intervalo não é maior que 31 dias
        const diffInDays = Math.ceil((request.endDate.getTime() - request.startDate.getTime()@core/ (1000 * 60 * 60 * 24));
        if (diffInDays > 31) {
            return AppError.invalidDate();
        }

        return true;
    }
}