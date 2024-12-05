// src/infra/nfse/queues/consumers/nfse-queue-consumer.ts

import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { I18nService } from '@/i18n/i18n.service';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { AbrasfNfseService } from '../../services/abrasf-nfse.service';
import { GetNfseCityProviderUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse-city-provider.use-case';
import { DanfseGeneratorService } from '../../services/danfse-generator.service';
import { NfseQueueProducer } from '../producers/nfse-queue-producer';
import { AppError } from '@/core/errors/app-errors';
import { NfseStatus } from '@/core/types/enums';

interface TransmitJobData {
    businessId: string;
    nfseId: string;
    language?: string;
    attempt?: number;
}

interface QueryJobData {
    businessId: string;
    nfseId: string;
    protocol?: string;
    attempt?: number;
}

@Injectable()
@Processor('nfse')
export class NfseQueueConsumer {
    private readonly logger = new Logger(NfseQueueConsumer.name);
    private readonly MAX_ATTEMPTS = 3;
    private readonly QUERY_RETRY_DELAY = 30000; // 30 segundos

    constructor(
        private nfseRepository: NfseRepository,
        private nfseService: AbrasfNfseService,
        private nfseQueueProducer: NfseQueueProducer,
        private getNfseCityProvider: GetNfseCityProviderUseCase,
        private danfseGenerator: DanfseGeneratorService,
        private i18n: I18nService
    ) { }

    @Process('transmit-nfse')
    async handleTransmitNfse(job: Job<TransmitJobData>) {
        const { businessId, nfseId, language = 'pt-BR', attempt = 1 } = job.data;

        try {
            // 1. Busca a NFSe
            const nfse = await this.nfseRepository.findById(nfseId, businessId);
            if (!nfse) {
                throw AppError.resourceNotFound(
                    this.i18n.translate('errors.NFSE_NOT_FOUND', language)
                );
            }

            // 2. Busca configuração da cidade
            const cityProviderResult = await this.getNfseCityProvider.execute({
                cityCode: nfse.incidenceCity
            }, language);

            if (cityProviderResult.isLeft()) {
                throw cityProviderResult.value;
            }

            const { provider: cityConfig } = cityProviderResult.value;

            // 3. Transmite para prefeitura
            const response = await this.nfseService.transmit(nfse, cityConfig);

            // 4. Se sucesso, gera PDF
            if (response.success && response.nfseNumber) {
                // Busca detalhes atualizados para gerar PDF
                const nfseDetails = await this.nfseRepository.findByIdDetails(nfseId, businessId);
                if (nfseDetails) {
                    const pdfResult = await this.danfseGenerator.generate(nfseDetails, cityConfig);

                    if (pdfResult.isRight()) {
                        nfse.pdfFileId = pdfResult.value.fileId;
                    }
                }
            }

            // 5. Se em processamento, agenda consulta
            if (response.protocol) {
                await this.nfseQueueProducer.addQueryNfseJob({
                    businessId,
                    nfseId,
                    protocol: response.protocol
                });
            }

            // 6. Salva NFSe
            await this.nfseRepository.save(nfse);

        } catch (error) {
            // Se ainda houver tentativas, recoloca na fila
            if (attempt < this.MAX_ATTEMPTS) {
                await job.retry({
                    ...job.data,
                    attempt: attempt + 1
                });
                return;
            }

            this.logger.error('Error processing NFSe transmission', {
                businessId,
                nfseId,
                attempt,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }

    @Process('query-nfse')
    async handleQueryNfse(job: Job<QueryJobData>) {
        const { businessId, nfseId, protocol, attempt = 1 } = job.data;

        try {
            // 1. Busca a NFSe
            const nfse = await this.nfseRepository.findById(nfseId, businessId);
            if (!nfse) {
                throw new Error('NFSe not found');
            }

            // 2. Busca configuração da cidade
            const cityProviderResult = await this.getNfseCityProvider.execute({
                cityCode: nfse.incidenceCity
            });

            if (cityProviderResult.isLeft()) {
                throw cityProviderResult.value;
            }

            const { provider: cityConfig } = cityProviderResult.value;

            // 3. Consulta status na prefeitura
            const response = await this.nfseService.query(nfse, cityConfig);

            // 4. Se ainda em processamento, agenda nova consulta
            if (response.status === 'PROCESSING') {
                if (attempt < 10) { // Máximo de 10 tentativas de consulta
                    await this.nfseQueueProducer.addQueryNfseJob({
                        businessId,
                        nfseId,
                        protocol,
                        attempt: attempt + 1
                    });
                } else {
                    nfse.status = NfseStatus.ERROR;
                }
                return;
            }

            // 5. Se autorizada, gera PDF
            if (response.success && nfse.status === NfseStatus.AUTHORIZED) {
                const nfseDetails = await this.nfseRepository.findByIdDetails(nfseId, businessId);
                if (nfseDetails) {
                    const pdfResult = await this.danfseGenerator.generate(nfseDetails, cityConfig);

                    if (pdfResult.isRight()) {
                        nfse.pdfFileId = pdfResult.value.fileId;
                    }
                }
            }

            // 6. Salva NFSe
            await this.nfseRepository.save(nfse);

        } catch (error) {
            this.logger.error('Error querying NFSe status', {
                businessId,
                nfseId,
                protocol,
                attempt,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }

    @OnQueueFailed()
    async handleFailure(job: Job, error: Error) {
        this.logger.error('Job failed', {
            jobId: job.id,
            jobName: job.name,
            error: error.message,
            data: job.data
        });

        // Se for transmissão e ainda houver tentativas
        if (job.name === 'transmit-nfse' && job.data.attempt < this.MAX_ATTEMPTS) {
            const delay = Math.pow(2, job.data.attempt) * 1000; // Backoff exponencial
            await job.retry({
                ...job.data,
                attempt: job.data.attempt + 1,
                delay
            });
        }
    }
}