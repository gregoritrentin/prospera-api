// src/infra/nfse/services/abrasf-nfse.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NfseProvider, NfseResponse } from '@/domain/dfe/nfse/providers/nfse-provider';
import { Nfse } from '@/domain/dfe/nfse/entities/nfse';
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event';
import { NfseEventType, NfseEventStatus, NfseStatus } from '@/core/types/enums';
import { XmlBuilder } from './xml-builder.service';

@Injectable()
export class AbrasfNfseService implements NfseProvider {
    private readonly logger = new Logger(AbrasfNfseService.name);

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
        private xmlBuilder: XmlBuilder,
    ) { }

    async transmit(nfse: Nfse): Promise<NfseResponse> {
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.TRANSMISSION,
            status: NfseEventStatus.PROCESSING,
        });

        nfse.addEvent(event);

        try {
            const xml = await this.xmlBuilder.buildNfseXml(nfse);
            event.requestXml = xml;

            this.logger.debug('Transmitting NFSe', {
                nfseId: nfse.id.toString(),
                xml
            });

            const response = await this.httpService.axiosRef.post(
                this.configService.get('NFSE_ENDPOINT'),
                xml,
                {
                    headers: {
                        'Content-Type': 'application/xml',
                    },
                },
            );

            const parsedResponse = this.parseResponse(response.data);

            event.responseXml = response.data;
            event.markAsSuccess(response.data, parsedResponse.message);

            return parsedResponse;

        } catch (error) {
            this.logger.error('Error transmitting NFSe', {
                nfseId: nfse.id.toString(),
                error: error.message,
            });

            event.markAsError(error.message);
            throw error;
        }
    }

    async cancel(nfse: Nfse, reason: string): Promise<NfseResponse> {
        const event = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.CANCELLATION,
            status: NfseEventStatus.PROCESSING,
        });

        nfse.addEvent(event);

        try {
            const xml = await this.xmlBuilder.buildCancellationXml(nfse, reason);
            event.requestXml = xml;

            this.logger.debug('Canceling NFSe', {
                nfseId: nfse.id.toString(),
                reason,
                xml
            });

            const response = await this.httpService.axiosRef.post(
                this.configService.get('NFSE_CANCEL_ENDPOINT'),
                xml,
                {
                    headers: {
                        'Content-Type': 'application/xml',
                    },
                },
            );

            const parsedResponse = this.parseResponse(response.data);

            event.responseXml = response.data;
            event.markAsSuccess(response.data, parsedResponse.message);

            return parsedResponse;

        } catch (error) {
            this.logger.error('Error canceling NFSe', {
                nfseId: nfse.id.toString(),
                error: error.message,
            });

            event.markAsError(error.message);
            throw error;
        }
    }

    async substitute(nfse: Nfse, substituteReason: string): Promise<NfseResponse> {
        // Implementação similar ao cancel
        throw new Error('Method not implemented.');
    }

    async query(nfseNumber: string, protocol: string): Promise<NfseResponse> {
        // Implementação da consulta
        throw new Error('Method not implemented.');
    }

    private parseResponse(xml: string): NfseResponse {
        // Implementação do parse da resposta XML
        // Deve retornar os dados conforme a interface NfseResponse
        return {
            protocol: '',
            nfseNumber: '',
            status: '',
            message: '',
            xml
        };
    }
}
