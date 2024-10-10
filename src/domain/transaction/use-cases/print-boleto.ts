import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AppError } from '@/core/errors/app-errors';
import { I18nService, Language } from '@/i18n/i18n.service';
import { BoletoQueueProducer } from '@/infra/queues/producers/boleto-queue-producer';

interface PrintBoletoRequest {
    businessId: string;
    boletoId: string;
    language?: Language;
}

type PrintBoletoResponse = Either<
    AppError,
    {
        jobId: string;
    }
>;

@Injectable()
export class PrintBoletoUseCase {
    constructor(
        private i18n: I18nService,
        private boletoQueueProducer: BoletoQueueProducer
    ) { }

    async execute({
        businessId,
        boletoId,
        language = 'pt-BR',
    }: PrintBoletoRequest): Promise<PrintBoletoResponse> {
        try {
            const job = await this.boletoQueueProducer.addPrintBoletoJob({
                businessId,
                boletoId,
                language,
            });

            return right({
                jobId: job.id.toString(),
            });

        } catch (error) {
            console.error('Erro ao adicionar job de impressão de boleto:', error);

            const errorMessage = this.i18n.translate('errors.BOLETO_PRINT_SCHEDULING_FAILED', language);
            const errorDetail = error instanceof Error ? error.message : 'Erro desconhecido';

            return left(
                AppError.boletoPrintFailed({
                    message: errorMessage,
                    details: {
                        businessId,
                        boletoId,
                        errorDetail
                    }
                })
            );
        }
    }
}