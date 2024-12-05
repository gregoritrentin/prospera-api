// src/infra/nfse/services/abrasf-nfse.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NfseProvider } from '@/domain/dfe/nfse/providers/nfse-provider';
import { NfseResponse } from '@/domain/dfe/nfse/providers/nfse-response';
import { NfseCityConfiguration } from '@/domain/dfe/nfse/entities/nfse-city-configuration';
import { Nfse } from '@/domain/dfe/nfse/entities/nfse';
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event';
import { NfseEventType, NfseEventStatus, NfseStatus } from '@/core/types/enums';
import { TransmissionBuilder } from '../xml/builders/transmission-builder';
import { QueryBuilder } from '../xml/builders/query-builder';
import { CancellationBuilder } from '../xml/builders/cancellation-builder';
import { CertificateSigningService } from './certificate-signing.service';
import { RpsResponseProcessor } from './rps-response-processor.service';

@Injectable()
export class AbrasfNfseService implements NfseProvider {
    private readonly logger = new Logger(AbrasfNfseService.name);
    private readonly RETRY_ATTEMPTS = 3;
    private readonly RETRY_DELAY = 1000; // 1 segundo

    constructor(
        private httpService: HttpService,
        private transmissionBuilder: TransmissionBuilder,
        private queryBuilder: QueryBuilder,
        private cancellationBuilder: CancellationBuilder,
        private certificateService: CertificateSigningService,
        private responseProcessor: RpsResponseProcessor
    ) { }

    async transmit(nfse: Nfse, config: NfseCityConfiguration): Promise<NfseResponse> {
        // Cria evento de transmissão
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.TRANSMISSION,
            status: NfseEventStatus.PROCESSING
        });

        try {
            // 1. Gera o XML
            const { xml, errors } = await this.transmissionBuilder.buildTransmissionXml(nfse, config);
            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined, errors);
                throw new Error('XML validation failed');
            }

            // 2. Assina o XML
            const { signedXml, event: signEvent } = await this.certificateService.signXml(
                xml,
                nfse.businessId.toString(),
                nfse.id
            );
            nfse.addEvent(signEvent);

            // 3. Registra XML no evento
            event.requestXml = signedXml;

            // 4. Faz requisição com retry
            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(signedXml, config, 'transmit');
            });

            // 5. Processa a resposta
            const processedResponse = await this.responseProcessor.processResponse({
                businessId: nfse.businessId.toString(),
                nfseId: nfse.id.toString(),
                xml: response
            });

            // 6. Atualiza evento
            if (processedResponse.isLeft()) {
                event.markAsError('Failed to process response', response);
                throw new Error('Response processing failed');
            }

            const { success, protocol, nfseNumber, message } = processedResponse.value;

            if (success) {
                event.markAsSuccess(response, message);
                nfse.protocol = protocol;
                nfse.nfseNumber = nfseNumber;
                nfse.status = NfseStatus.AUTHORIZED;
            } else {
                event.markAsError(message, response);
                nfse.status = NfseStatus.ERROR;
            }

            return processedResponse.value;

        } catch (error) {
            this.logger.error('Error transmitting NFSe', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            event.markAsError(
                error instanceof Error ? error.message : 'Unknown error',
                event.responseXml
            );
            nfse.status = NfseStatus.ERROR;
            nfse.addEvent(event);

            throw error;
        }
    }

    async query(nfse: Nfse, config: NfseCityConfiguration): Promise<NfseResponse> {
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.QUERY,
            status: NfseEventStatus.PROCESSING
        });

        try {
            // 1. Gera XML de consulta
            const { xml, errors } = await this.queryBuilder.buildQueryByRps({
                rpsNumber: nfse.rpsNumber,
                rpsSeries: nfse.rpsSeries,
                rpsType: nfse.rpsType.toString(),
                businessId: nfse.businessId.toString(),
                inscricaoMunicipal: config.getSpecificField('inscricaoMunicipal', '')
            }, config);

            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined, errors);
                throw new Error('XML validation failed');
            }

            event.requestXml = xml;

            // 2. Faz requisição com retry
            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(xml, config, 'query');
            });

            // 3. Processa resposta
            const processedResponse = await this.responseProcessor.processResponse({
                businessId: nfse.businessId.toString(),
                nfseId: nfse.id.toString(),
                xml: response
            });

            if (processedResponse.isLeft()) {
                event.markAsError('Failed to process response', response);
                throw new Error('Response processing failed');
            }

            const { success, message } = processedResponse.value;

            if (success) {
                event.markAsSuccess(response, message);
            } else {
                event.markAsError(message, response);
            }

            nfse.addEvent(event);
            return processedResponse.value;

        } catch (error) {
            this.logger.error('Error querying NFSe', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            event.markAsError(
                error instanceof Error ? error.message : 'Unknown error',
                event.responseXml
            );
            nfse.addEvent(event);

            throw error;
        }
    }

    async cancel(
        nfse: Nfse,
        reason: string,
        config: NfseCityConfiguration
    ): Promise<NfseResponse> {
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.CANCELLATION,
            status: NfseEventStatus.PROCESSING
        });

        try {
            // 1. Gera XML de cancelamento
            const { xml, errors } = await this.cancellationBuilder.buildCancellation({
                nfseNumber: nfse.nfseNumber,
                businessId: nfse.businessId.toString(),
                inscricaoMunicipal: config.getSpecificField('inscricaoMunicipal', ''),
                cityCode: config.cityCode,
                cancelReason: nfse.cancelReason,
                cancelText: reason
            }, config);

            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined, errors);
                throw new Error('XML validation failed');
            }

            // 2. Assina o XML
            const { signedXml, event: signEvent } = await this.certificateService.signXml(
                xml,
                nfse.businessId.toString(),
                nfse.id
            );
            nfse.addEvent(signEvent);

            event.requestXml = signedXml;

            // 3. Faz requisição com retry
            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(signedXml, config, 'cancel');
            });

            // 4. Processa resposta
            const processedResponse = await this.responseProcessor.processResponse({
                businessId: nfse.businessId.toString(),
                nfseId: nfse.id.toString(),
                xml: response
            });

            if (processedResponse.isLeft()) {
                event.markAsError('Failed to process response', response);
                throw new Error('Response processing failed');
            }

            const { success, message } = processedResponse.value;

            if (success) {
                event.markAsSuccess(response, message);
                nfse.status = NfseStatus.CANCELED;
                nfse.canceledAt = new Date();
            } else {
                event.markAsError(message, response);
            }

            nfse.addEvent(event);
            return processedResponse.value;

        } catch (error) {
            this.logger.error('Error canceling NFSe', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            event.markAsError(
                error instanceof Error ? error.message : 'Unknown error',
                event.responseXml
            );
            nfse.addEvent(event);

            throw error;
        }
    }

    private async makeRequest(
        xml: string,
        config: NfseCityConfiguration,
        operation: 'transmit' | 'query' | 'cancel'
    ): Promise<string> {
        const endpoint = this.getEndpoint(config, operation);

        const response = await firstValueFrom(
            this.httpService.post(endpoint, xml, {
                headers: {
                    'Content-Type': 'application/xml',
                    'SOAPAction': this.getSoapAction(operation)
                },
                timeout: config.timeout
            })
        );

        return response.data;
    }

    private getEndpoint(
        config: NfseCityConfiguration,
        operation: 'transmit' | 'query' | 'cancel'
    ): string {
        const endpoints = {
            transmit: config.productionUrl,
            query: config.queryUrl || config.productionUrl,
            cancel: config.productionUrl
        };

        return endpoints[operation];
    }

    private getSoapAction(operation: 'transmit' | 'query' | 'cancel'): string {
        const actions = {
            transmit: 'http://nfse.abrasf.org.br/RecepcionarLoteRps',
            query: 'http://nfse.abrasf.org.br/ConsultarNfsePorRps',
            cancel: 'http://nfse.abrasf.org.br/CancelarNfse'
        };

        return actions[operation];
    }

    private async executeWithRetry<T>(
        operation: () => Promise<T>,
        attempt: number = 1
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            if (attempt >= this.RETRY_ATTEMPTS) {
                throw error;
            }

            this.logger.warn(`Retrying operation (${attempt}/${this.RETRY_ATTEMPTS})`, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
            return this.executeWithRetry(operation, attempt + 1);
        }
    }
}