// src/infra/nfse/queues/nfse-queue-consumer.ts

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { I18nService } from '@/i18n';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { AbrasfNfseService } from '@/infra/nfse/services/abrasf-nfse.service';
import { NfseQueueProducer } from '@/infra/queues/producers/nfse-queue-producer';
import { GetNfseCityProviderUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse-city-provider.use-case';
import { DanfseGeneratorService } from '@/infra/nfse/services/danfse-generator.service';

@Processor('nfse')
export class NfseQueueConsumer {
    private readonly logger = new Logger(NfseQueueConsumer.name);

    constructor(
        private nfseRepository: NfseRepository,
        private abrasfNfseService: AbrasfNfseService,
        @Inject(forwardRef(() => NfseQueueProducer)) //private nfseQueueProducer: NfseQueueProducer,
        private getNfseCityProviderUseCase: GetNfseCityProviderUseCase,
        private danfseGeneratorService: DanfseGeneratorService,
        private i18nService: I18nService,
    ) { }

    @Process('transmit-nfse')
    async handleTransmitNfse(job: Job) {
        this.logger.log(`Processing transmit NFSe job: ${job.id}`);
        const { businessId, nfseId, language } = job.data;

        try {
            // Implementar lógica de transmissão
            this.logger.log(`Transmit NFSe job completed: ${job.id}`);
        } catch (error) {
            this.logger.error(`Error processing transmit NFSe job: ${job.id}`, error);
            throw error;
        }
    }

    @Process('query-nfse')
    async handleQueryNfse(job: Job) {
        this.logger.log(`Processing query NFSe job: ${job.id}`);
        const { businessId, nfseId, protocol } = job.data;

        try {
            // Implementar lógica de consulta
            this.logger.log(`Query NFSe job completed: ${job.id}`);
        } catch (error) {
            this.logger.error(`Error processing query NFSe job: ${job.id}`, error);
            throw error;
        }
    }
}