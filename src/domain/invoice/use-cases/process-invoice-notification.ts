// src/domain/invoice/use-cases/process-invoice-notifications.use-case.ts

import { Injectable, Inject } from '@nestjs/common';
import { Either, right, left } from '@/core/either';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { QueueProvider } from '@/domain/providers/queue-provider';

interface ProcessInvoiceNotificationsRequest {
    date: Date;
}

type ProcessInvoiceNotificationsResponse = Either<
    AppError,
    {
        jobId: string;
        message: string;
    }
>;

@Injectable()
export class ProcessInvoiceNotificationsUseCase {
    constructor(
        private i18nService: I18nService,
        @Inject(QueueProvider)
        private queueService: QueueProvider
    ) { }

    async execute(
        request: ProcessInvoiceNotificationsRequest,
        language: string | Language = 'pt-BR'
    ): Promise<ProcessInvoiceNotificationsResponse> {
        try {
            // Enfileira o job de processamento de notificações
            const result = await this.queueService.addJob(
                'invoice-notifications',
                'process',
                {
                    date: request.date,
                    language
                }
            );

            return right({
                jobId: result.jobId,
                message: this.i18nService.translate('messages.INVOICE_NOTIFICATIONS_QUEUED', language)
            });
        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.INVOICE_NOTIFICATIONS_ERROR', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.internalServerError(errorMessage));
        }
    }
}