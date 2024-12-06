import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NfseProvider, NfseResponse } from '@/domain/interfaces/nfse-provider';
import { NfseCityConfiguration } from '@/domain/dfe/nfse/entities/nfse-city-configuration';
import { Nfse } from '@/domain/dfe/nfse/entities/nfse';
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event';
import { NfseEventType, NfseEventStatus, NfseStatus, NfseCancelReason } from '@/core/types/enums';
import { TransmissionBuilder } from '@/infra/nfse/xml/builders/transmition-builder';
import { QueryBuilder } from '../xml/builders/query-builder';
import { CancellationBuilder } from '../xml/builders/cancellation-builder';
import { CertificateSigningService } from './certificate-signing.service';
import { RpsResponseProcessor } from './rps-response-processor.service';
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface BusinessDataForXml {
    inscricaoMunicipal: string;
    simplesNacional: string;
}

@Injectable()
export class AbrasfNfseService implements NfseProvider {
    private readonly logger = new Logger(AbrasfNfseService.name);
    private readonly RETRY_ATTEMPTS = 3;
    private readonly RETRY_DELAY = 1000;

    constructor(
        private httpService: HttpService,
        private transmissionBuilder: TransmissionBuilder,
        private queryBuilder: QueryBuilder,
        private cancellationBuilder: CancellationBuilder,
        private certificateService: CertificateSigningService,
        private responseProcessor: RpsResponseProcessor,
        private getBusinessUseCase: GetBusinessUseCase,
        private cityConfig: NfseCityConfiguration
    ) { }

    private async getBusinessData(businessId: string): Promise<BusinessDataForXml> {
        const result = await this.getBusinessUseCase.execute({ businessId });

        if (result.isRight()) {
            const business = result.value.business[0];
            return {
                inscricaoMunicipal: business.im ?? '',
                simplesNacional: business.businessSize === 'SIMPLES_NACIONAL' ? '1' : '2'
            };
        }

        throw new Error('Failed to fetch business data');
    }

    async transmit(nfse: Nfse): Promise<NfseResponse> {
        const businessData = await this.getBusinessData(nfse.businessId.toString());
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.TRANSMISSION,
            status: NfseEventStatus.PROCESSING
        });

        try {
            const { xml, errors } = await this.transmissionBuilder.buildTransmissionXml(
                nfse,
                this.cityConfig,
                businessData
            );

            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined);
                throw new Error('XML validation failed');
            }

            const { signedXml, event: signEvent } = await this.certificateService.signXml(
                xml,
                nfse.businessId.toString(),
                nfse.id
            );
            nfse.addEvent(signEvent);

            event.requestXml = signedXml;

            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(signedXml, this.cityConfig, 'transmit');
            });

            const processedResponse = await this.responseProcessor.processResponse({
                businessId: nfse.businessId.toString(),
                nfseId: nfse.id.toString(),
                xml: response
            });

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

            nfse.addEvent(event);
            return {
                protocol: processedResponse.value.protocol ?? '',
                nfseNumber: processedResponse.value.nfseNumber ?? '',
                status: success ? NfseStatus.AUTHORIZED : NfseStatus.ERROR,
                message: processedResponse.value.message,
                xml: response
            };

        } catch (error) {
            this.logger.error('Error transmitting NFSe', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            event.markAsError(
                error instanceof Error ? error.message : 'Unknown error',
                event.responseXml ?? undefined
            );
            nfse.status = NfseStatus.ERROR;
            nfse.addEvent(event);

            throw error;
        }
    }

    async query(nfseNumber: string): Promise<NfseResponse> {
        const result = await this.getBusinessUseCase.execute({ businessId: this.cityConfig.cityCode });

        if (result.isLeft()) {
            throw new Error('Failed to fetch business data');
        }

        const business = result.value.business[0];
        const event = NfseEvent.create({
            nfseId: new UniqueEntityID(),
            type: NfseEventType.QUERY,
            status: NfseEventStatus.PROCESSING
        });

        try {
            const { xml, errors } = await this.queryBuilder.buildQueryByNumber({
                nfseNumber,
                businessId: business.document,
                inscricaoMunicipal: business.im ?? ''
            }, this.cityConfig);

            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined);
                throw new Error('XML validation failed');
            }

            event.requestXml = xml;

            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(xml, this.cityConfig, 'query');
            });

            const processedResponse = await this.responseProcessor.processResponse({
                businessId: business.document,
                nfseId: nfseNumber,
                xml: response
            });

            if (processedResponse.isLeft()) {
                event.markAsError('Failed to process response', response);
                throw new Error('Response processing failed');
            }

            const { success, message } = processedResponse.value;

            return {
                protocol: processedResponse.value.protocol ?? '',
                nfseNumber: processedResponse.value.nfseNumber ?? '',
                status: success ? NfseStatus.AUTHORIZED : NfseStatus.ERROR,
                message,
                xml: response
            };

        } catch (error) {
            this.logger.error('Error querying NFSe', {
                nfseNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }

    async cancel(nfse: Nfse, reason: string): Promise<NfseResponse> {
        const businessData = await this.getBusinessData(nfse.businessId.toString());
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.CANCELLATION,
            status: NfseEventStatus.PROCESSING
        });

        try {
            const { xml, errors } = await this.cancellationBuilder.buildCancellation({
                nfseNumber: nfse.nfseNumber ?? '',
                businessId: nfse.businessId.toString(),
                inscricaoMunicipal: businessData.inscricaoMunicipal,
                cityCode: this.cityConfig.cityCode,
                cancelReason: nfse.cancelReason as NfseCancelReason,
                cancelText: reason
            }, this.cityConfig);

            if (errors.length > 0) {
                event.markAsError('XML validation errors', undefined);
                throw new Error('XML validation failed');
            }

            const { signedXml, event: signEvent } = await this.certificateService.signXml(
                xml,
                nfse.businessId.toString(),
                nfse.id
            );
            nfse.addEvent(signEvent);

            event.requestXml = signedXml;

            const response = await this.executeWithRetry(async () => {
                return await this.makeRequest(signedXml, this.cityConfig, 'cancel');
            });

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
            return {
                protocol: processedResponse.value.protocol ?? '',
                nfseNumber: processedResponse.value.nfseNumber ?? '',
                status: success ? NfseStatus.CANCELED : NfseStatus.ERROR,
                message,
                xml: response
            };

        } catch (error) {
            this.logger.error('Error canceling NFSe', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            event.markAsError(
                error instanceof Error ? error.message : 'Unknown error',
                event.responseXml ?? undefined
            );
            nfse.addEvent(event);

            throw error;
        }
    }

    async substitute(nfse: Nfse, substituteReason: string): Promise<NfseResponse> {
        throw new Error('Substitution not implemented for this provider');
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
            query: config.productionUrl,
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