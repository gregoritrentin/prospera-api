import { Injectable } from '@nestjs/common'
import { BoletoProvider } from '@/modules/transaction/infra/provider/boleto-provider'
import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'

import { Either, left, right } from @core/co@core/either';
import { AppError } from @core/co@core/erro@core/app-errors';
import { I18nService, Language } from @core/i1@core/i18n.service';

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