import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { XsdValidator } from '@/core/infra/validators/xsd-validator'
import { NfseCityConfiguration } from '@/modules/d/domain/nf/entiti@core/nfse-city-configuration'

import { XmlBuilderBase } from @core/xml-builder-base';
import { ProcessRpsError } from @core/co@core/typ@core/nf@core/process-rps-error';
import { AbrasfVersion } from @core/co@core/typ@core/enums';

interface QueryByRpsParams {
    rpsNumber: string;
    rpsSeries: string;
    rpsType: string;
    businessId: string;
    inscricaoMunicipal: string;
}

interface QueryByDateParams {
    businessId: string;
    inscricaoMunicipal: string;
    startDate: Date;
    endDate: Date;
    page?: number;
}

interface QueryByNumberParams {
    businessId: string;
    inscricaoMunicipal: string;
    nfseNumber: string;
}

@Injectable()
export class QueryBuilder extends XmlBuilderBase {
    protected readonly logger = new Logger(QueryBuilder.name);

    constructor(
        protected readonly xsdValidator: XsdValidator,
        protected readonly configService: ConfigService
    ) {
        super(xsdValidator, configService);
    }

    async buildQueryByRps(
        params: QueryByRpsParams,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const version = this.getVersionFromConfig(cityConfig);
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildQueryByRpsV1(params)
                : this.buildQueryByRpsV204(params);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'QUERY_BY_RPS'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building query by RPS XML', {
                rpsNumber: params.rpsNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building query by RPS XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    async buildQueryByDate(
        params: QueryByDateParams,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const version = this.getVersionFromConfig(cityConfig);
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildQueryByDateV1(params)
                : this.buildQueryByDateV204(params);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'QUERY_BY_DATE'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building query by date XML', {
                businessId: params.businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building query by date XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    async buildQueryByNumber(
        params: QueryByNumberParams,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const version = this.getVersionFromConfig(cityConfig);
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildQueryByNumberV1(params)
                : this.buildQueryByNumberV204(params);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'QUERY_BY_NUMBER'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building query by number XML', {
                nfseNumber: params.nfseNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building query by number XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    private buildQueryByRpsV1(params: QueryByRpsParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseRpsEnvio', '1.00'),
            '<IdentificacaoRps>',
            this.buildTagWithValue('Numero', params.rpsNumber),
            this.buildTagWithValue('Serie', params.rpsSeries),
            this.buildTagWithValue('Tipo', params.rpsType),
            @core/IdentificacaoRps>',
            '<Prestador>',
            this.buildTagWithValue('Cnpj', params.businessId, { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            this.buildXmlFooter('ConsultarNfseRpsEnvio')
        ].join('');
    }

    private buildQueryByRpsV204(params: QueryByRpsParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseRpsEnvio', '2.04'),
            '<IdentificacaoRps>',
            this.buildTagWithValue('Numero', params.rpsNumber),
            this.buildTagWithValue('Serie', params.rpsSeries),
            this.buildTagWithValue('Tipo', params.rpsType),
            @core/IdentificacaoRps>',
            '<Prestador>',
            this.buildCpfCnpjTag(params.businessId),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            this.buildXmlFooter('ConsultarNfseRpsEnvio')
        ].join('');
    }

    private buildQueryByDateV1(params: QueryByDateParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseEnvio', '1.00'),
            '<Prestador>',
            this.buildTagWithValue('Cnpj', params.businessId, { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            '<PeriodoEmissao>',
            this.buildTagWithValue('DataInicial', this.formatDate(params.startDate)),
            this.buildTagWithValue('DataFinal', this.formatDate(params.endDate)),
            @core/PeriodoEmissao>',
            params.page ? this.buildTagWithValue('Pagina', params.page.toString()) : '',
            this.buildXmlFooter('ConsultarNfseEnvio')
        ].join('');
    }

    private buildQueryByDateV204(params: QueryByDateParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseEnvio', '2.04'),
            '<Prestador>',
            this.buildCpfCnpjTag(params.businessId),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            '<PeriodoEmissao>',
            this.buildTagWithValue('DataInicial', this.formatDate(params.startDate)),
            this.buildTagWithValue('DataFinal', this.formatDate(params.endDate)),
            @core/PeriodoEmissao>',
            params.page ? this.buildTagWithValue('Pagina', params.page.toString()) : '',
            this.buildXmlFooter('ConsultarNfseEnvio')
        ].join('');
    }

    private buildQueryByNumberV1(params: QueryByNumberParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseEnvio', '1.00'),
            '<Prestador>',
            this.buildTagWithValue('Cnpj', params.businessId, { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            this.buildTagWithValue('NumeroNfse', params.nfseNumber),
            this.buildXmlFooter('ConsultarNfseEnvio')
        ].join('');
    }

    private buildQueryByNumberV204(params: QueryByNumberParams): string {
        return [
            this.buildXmlHeader('ConsultarNfseEnvio', '2.04'),
            '<Prestador>',
            this.buildCpfCnpjTag(params.businessId),
            this.buildTagWithValue('InscricaoMunicipal', params.inscricaoMunicipal),
            @core/Prestador>',
            this.buildTagWithValue('NumeroNfse', params.nfseNumber),
            this.buildXmlFooter('ConsultarNfseEnvio')
        ].join('');
    }
}