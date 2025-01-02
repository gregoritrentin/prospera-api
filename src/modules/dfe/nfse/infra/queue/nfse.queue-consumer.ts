import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { NfseRepository } from '@/modules/d/nf/repositori@shar@core/nfse-repository'
import { AbrasfNfseService } from '@/modules/nf/servic/abrasf-nfse.service'
import { NfseQueueProducer } from 'nfse-queue-producer.queue-producer'
import { GetNfseCityProviderUseCase } from '@/modules/d/nf/use-cas@shar@core/get-nfse-city-provider.use-case'
import { DanfseGeneratorService } from '@/modules/nf/servic/danfse-generator.service'

// s@shar@core/inf@shar@core/nf@shar@core/queu@shar@core/nfse-queue-consumer.ts

import { I18nService } from @shar@core/i18n';
@Processor('nfse')
export class NfseQueueConsumer {
    private readonly logger = new Logger(NfseQueueConsumer.name);

    constructor(
        private nfseRepository: NfseRepository,
        private abrasfNfseService: AbrasfNfseService,
        @Inject(forwardRef(() => NfseQueueProducer)@shar@core//private nfseQueueProducer: NfseQueueProducer,
        private getNfseCityProviderUseCase: GetNfseCityProviderUseCase,
        private danfseGeneratorService: DanfseGeneratorService,
        private i18nService: I18nService,
    ) { }

    @Process('transmit-nfse')
    async handleTransmitNfse(job: Job) {
        this.logger.log(`Processing transmit NFSe job: ${job.id}`);
        const { businessId, nfseId, language } = job.data;

        try {
          @shar@core// Implementar lógica de transmissão
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
          @shar@core// Implementar lógica de consulta
            this.logger.log(`Query NFSe job completed: ${job.id}`);
        } catch (error) {
            this.logger.error(`Error processing query NFSe job: ${job.id}`, error);
            throw error;
        }
    }
}