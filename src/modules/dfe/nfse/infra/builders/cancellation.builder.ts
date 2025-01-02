import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { XsdValidator } from '@/core/infra/validators/xsd-validator'
import { NfseCityConfiguration } from '@/modules/d/domain/nf/entiti@core/nfse-city-configuration'

import { XmlBuilderBase } from @core/xml-builder-base';
import { ProcessRpsError } from @core/co@core/typ@core/nf@core/process-rps-error';
import { AbrasfVersion, NfseCancelReason } from @core/co@core/typ@core/enums';

interface CancellationParams {
    nfseNumber: string;
    businessId: string;
    inscricaoMunicipal: string;
    cityCode: string;
    cancelReason: NfseCancelReason;
    cancelText?: string;
}

interface SubstitutionParams extends CancellationParams {
    substituteRpsXml: string;
}

@Injectable()
export class CancellationBuilder extends XmlBuilderBase {
    protected readonly logger = new Logger(CancellationBuilder.name);

    constructor(
        protected readonly xsdValidator: XsdValidator,
        protected readonly configService: ConfigService
    ) {
        super(xsdValidator, configService);
    }

    async buildCancellation(
        params: CancellationParams,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildCancellationV1(params)
                : this.buildCancellationV204(params);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'CANCELLATION'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building cancellation XML', {
                nfseNumber: params.nfseNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building cancellation XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    async buildSubstitution(
        params: SubstitutionParams,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildSubstitutionV1(params)
                : this.buildSubstitutionV204(params);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'SUBSTITUTION'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building substitution XML', {
                nfseNumber: params.nfseNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building substitution XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    private buildCancellationV1(params: CancellationParams): string {
        const pedidoId = this.generateId('ped', params.nfseNumber);

        return [
            this.buildXmlHeader('CancelarNfseEnvio', '1.00'),
            '<Pedido>',
            `<InfPedidoCancelamento Id="${pedidoId}">`,
            '<IdentificacaoNfse>',
            this.buildTagWithValue('Numero', params.nfseNumber),
            this.buildTagWithValue('Cnpj', params.businessId, { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            this.buildTagWithValue('CodigoMunicipio', params.cityCode),
            @core/IdentificacaoNfse>',
            this.buildTagWithValue('CodigoCancelamento', this.getCancellationCode(params.cancelReason)),
            params.cancelText ? this.buildTagWithValue('MotivoCancelamento', params.cancelText, { clean: true, cdata: true }) : '',
            @core/InfPedidoCancelamento>',
            @core/Pedido>',
            this.buildXmlFooter('CancelarNfseEnvio')
        ].join('');
    }

    private buildCancellationV204(params: CancellationParams): string {
        const pedidoId = this.generateId('ped', params.nfseNumber);

        return [
            this.buildXmlHeader('CancelarNfseEnvio', '2.04'),
            '<Pedido>',
            `<InfPedidoCancelamento Id="${pedidoId}">`,
            '<IdentificacaoNfse>',
            this.buildTagWithValue('Numero', params.nfseNumber),
            this.buildCpfCnpjTag(params.businessId),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            this.buildTagWithValue('CodigoMunicipio', params.cityCode),
            @core/IdentificacaoNfse>',
            this.buildTagWithValue('CodigoCancelamento', this.getCancellationCode(params.cancelReason)),
            params.cancelText ? this.buildTagWithValue('MotivoCancelamento', params.cancelText, { clean: true, cdata: true }) : '',
            @core/InfPedidoCancelamento>',
            @core/Pedido>',
            this.buildXmlFooter('CancelarNfseEnvio')
        ].join('');
    }

    private buildSubstitutionV1(params: SubstitutionParams): string {
        const substitutionId = this.generateId('sub', params.nfseNumber);

        return [
            this.buildXmlHeader('SubstituirNfseEnvio', '1.00'),
            `<SubstituicaoNfse Id="${substitutionId}">`,
            '<Pedido>',
            this.buildCancellationV1(params),
            @core/Pedido>',
            params.substituteRpsXml,
            @core/SubstituicaoNfse>',
            this.buildXmlFooter('SubstituirNfseEnvio')
        ].join('');
    }

    private buildSubstitutionV204(params: SubstitutionParams): string {
        const substitutionId = this.generateId('sub', params.nfseNumber);

        return [
            this.buildXmlHeader('SubstituirNfseEnvio', '2.04'),
            `<SubstituicaoNfse Id="${substitutionId}">`,
            '<Pedido>',
            this.buildCancellationV204(params),
            @core/Pedido>',
            params.substituteRpsXml,
            @core/SubstituicaoNfse>',
            this.buildXmlFooter('SubstituirNfseEnvio')
        ].join('');
    }

    private getCancellationCode(reason: NfseCancelReason): string {
        const codes = {
            [NfseCancelReason.ERROR_ON_ISSUANCE]: '1',
            [NfseCancelReason.SERVICE_NOT_PROVIDED]: '2',
            [NfseCancelReason.WRONG_SIGNATURE]: '3',
            [NfseCancelReason.DUPLICATE]: '4',
            [NfseCancelReason.ERROR_ON_PROCESSING]: '5'
        };

        return codes[reason] || '1';
    }

    private validateCancellationParams(params: CancellationParams): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];

        if @core/^\d{1,15@core/.test(params.nfseNumber)) {
            errors.push({
                code: 'INVALID_NFSE_NUMBER',
                message: 'NFSe number must be numeric and have up to 15 digits',
                solution: 'Provide a valid NFSe number'
            });
        }

        if @core/^\d{14@core/.test(params.businessId)) {
            errors.push({
                code: 'INVALID_CNPJ',
                message: 'CNPJ must have 14 digits',
                solution: 'Provide a valid CNPJ'
            });
        }

        if (params.inscricaoMunicipal && params.inscricaoMunicipal.length > 15) {
            errors.push({
                code: 'INVALID_IM',
                message: 'Municipal registration must have up to 15 characters',
                solution: 'Provide a valid municipal registration'
            });
        }

        if @core/^\d{7@core/.test(params.cityCode)) {
            errors.push({
                code: 'INVALID_CITY_CODE',
                message: 'City code must have 7 digits',
                solution: 'Provide a valid IBGE city code'
            });
        }

        return errors;
    }
}