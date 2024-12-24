import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { BoletoProvider } from '@/domain/providers/boleto-provider';
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository';
import { AppError } from '@/core/errors/app-errors';
import { I18nService, Language } from '@/i18n/i18n.service';

interface CancelBoletoUseCaseRequest {
    businessId: string;
    boletoId: string;
    language?: Language;
}

type CancelBoletoUseCaseResponse = Either<
    AppError,
    { message: string }
>

@Injectable()
export class CancelBoletoUseCase {
    constructor(
        private boletoProvider: BoletoProvider,
        private boletoRepository: TransactionRepository,
        private i18n: I18nService
    ) { }

    async execute({
        businessId,
        boletoId,
        language,
    }: CancelBoletoUseCaseRequest): Promise<CancelBoletoUseCaseResponse> {
        const boleto = await this.boletoRepository.findById(boletoId, businessId);

        if (!boleto || !boleto.ourNumber) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
        }

        if (boleto.status === 'CANCELED') {
            return left(AppError.boletoCancelationFailed({ message: 'errors.BOLETO_CANCELATION_FAILED' }));
        }

        try {
            await this.boletoProvider.cancelBoleto(boleto.ourNumber);

            boleto.status = 'CANCELED';
            await this.boletoRepository.save(boleto);

            const message = this.i18n.translate('messages.RECORD_UPDATED', language);
            return right({ message });

        } catch (error) {
            console.error('Erro ao cancelar boleto:', error);
            const errorMessage = this.i18n.translate('errors.SICREDI_ERROR_FULL', language, {
                action: 'cancelar',
                errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
            });
            return left(AppError.boletoCancelationFailed({ message: errorMessage }));
        }
    }
}