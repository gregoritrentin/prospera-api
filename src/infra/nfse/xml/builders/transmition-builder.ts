// src/infra/nfse/xml/builders/transmission-builder.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { XmlBuilderBase } from './xml-builder-base';
import { XsdValidator } from '../validators/xsd-validator';
import { Nfse } from '@/domain/dfe/nfse/entities/nfse';
import { NfseCityConfiguration } from '@/domain/dfe/nfse/entities/nfse-city-configuration';
import { ProcessRpsError } from '@/core/types/nfse/process-rps-error';
import { AbrasfVersion } from '@/core/types/enums';

@Injectable()
export class TransmissionBuilder extends XmlBuilderBase {
    private readonly logger = new Logger(TransmissionBuilder.name);

    constructor(
        protected readonly xsdValidator: XsdValidator,
        protected readonly configService: ConfigService
    ) {
        super(xsdValidator, configService);
    }

    async buildTransmissionXml(
        nfse: Nfse,
        cityConfig: NfseCityConfiguration
    ): Promise<{
        xml: string;
        errors: ProcessRpsError[];
    }> {
        try {
            const version = this.getVersionFromConfig(cityConfig);
            const xml = cityConfig.abrasfVersion === AbrasfVersion.V1_0
                ? this.buildV1(nfse, cityConfig)
                : this.buildV204(nfse, cityConfig);

            const errors = await this.validateXml(
                xml,
                cityConfig.abrasfVersion,
                'TRANSMISSION'
            );

            return { xml, errors };
        } catch (error) {
            this.logger.error('Error building transmission XML', {
                nfseId: nfse.id.toString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                xml: '',
                errors: [{
                    code: 'BUILD_ERROR',
                    message: 'Error building transmission XML',
                    solution: 'Check input data and try again'
                }]
            };
        }
    }

    private buildV1(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        const loteId = this.generateId('lote', nfse.rpsNumber);
        const rpsId = this.generateId('rps', nfse.rpsNumber);

        return [
            this.buildXmlHeader('EnviarLoteRpsEnvio', '1.00'),
            `<LoteRps Id="${loteId}">`,
            `<NumeroLote>1</NumeroLote>`,
            this.buildCpfCnpj(nfse.businessId.toString()),
            this.buildTagWithValue('InscricaoMunicipal', cityConfig.getSpecificField('inscricaoMunicipal', '')),
            `<QuantidadeRps>1</QuantidadeRps>`,
            '<ListaRps>',
            `<Rps>`,
            `<InfRps Id="${rpsId}">`,
            this.buildRpsV1(nfse, cityConfig),
            '</InfRps>',
            '</Rps>',
            '</ListaRps>',
            '</LoteRps>',
            this.buildXmlFooter('EnviarLoteRpsEnvio')
        ].join('');
    }

    private buildV204(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        const loteId = this.generateId('lote', nfse.rpsNumber);
        const rpsId = this.generateId('rps', nfse.rpsNumber);

        return [
            this.buildXmlHeader('EnviarLoteRpsEnvio', '2.04'),
            `<LoteRps Id="${loteId}" versao="2.04">`,
            `<NumeroLote>1</NumeroLote>`,
            this.buildCpfCnpj(nfse.businessId.toString()),
            this.buildTagWithValue('InscricaoMunicipal', cityConfig.getSpecificField('inscricaoMunicipal', '')),
            `<QuantidadeRps>1</QuantidadeRps>`,
            '<ListaRps>',
            `<Rps>`,
            `<InfRps Id="${rpsId}">`,
            this.buildRpsV204(nfse, cityConfig),
            '</InfRps>',
            '</Rps>',
            '</ListaRps>',
            '</LoteRps>',
            this.buildXmlFooter('EnviarLoteRpsEnvio')
        ].join('');
    }

    private buildRpsV1(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        return [
            '<IdentificacaoRps>',
            this.buildTagWithValue('Numero', nfse.rpsNumber),
            this.buildTagWithValue('Serie', nfse.rpsSeries),
            this.buildTagWithValue('Tipo', nfse.rpsType.toString()),
            '</IdentificacaoRps>',
            this.buildTagWithValue('DataEmissao', this.formatDateTime(nfse.issueDate)),
            this.buildTagWithValue('NaturezaOperacao', nfse.operationType.toString()),
            this.buildTagWithValue('RegimeEspecialTributacao', nfse.issRequirement.toString()),
            this.buildTagWithValue('OptanteSimplesNacional', cityConfig.getSpecificField('simplesNacional', '2')),
            this.buildTagWithValue('IncentivadorCultural', '2'),
            this.buildTagWithValue('Status', '1'),
            this.buildServiceV1(nfse),
            this.buildPrestadorV1(nfse, cityConfig),
            this.buildTomadorV1(nfse),
        ].join('');
    }

    private buildRpsV204(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        return [
            '<IdentificacaoRps>',
            this.buildTagWithValue('Numero', nfse.rpsNumber),
            this.buildTagWithValue('Serie', nfse.rpsSeries),
            this.buildTagWithValue('Tipo', nfse.rpsType.toString()),
            '</IdentificacaoRps>',
            this.buildTagWithValue('DataEmissao', this.formatDateTime(nfse.issueDate)),
            this.buildTagWithValue('NaturezaOperacao', nfse.operationType.toString()),
            this.buildTagWithValue('RegimeEspecialTributacao', nfse.issRequirement.toString()),
            this.buildTagWithValue('OptanteSimplesNacional', cityConfig.getSpecificField('simplesNacional', '2')),
            this.buildTagWithValue('IncentivadorCultural', '2'),
            this.buildTagWithValue('Status', '1'),
            this.buildServiceV204(nfse),
            this.buildPrestadorV204(nfse, cityConfig),
            this.buildTomadorV204(nfse),
        ].join('');
    }

    private buildServiceV1(nfse: Nfse): string {
        return [
            '<Servico>',
            this.buildValuesTag({
                serviceAmount: nfse.serviceAmount,
                deductions: nfse.unconditionalDiscount,
                pis: nfse.pisAmount,
                cofins: nfse.cofinsAmount,
                inss: nfse.inssAmount,
                ir: nfse.irAmount,
                csll: nfse.csllAmount,
                issRetention: nfse.issRetention,
                issAmount: nfse.issAmount,
                issRetentionAmount: nfse.issRetention ? nfse.issAmount : 0,
                otherRetentions: nfse.otherRetentions,
                baseCalculation: nfse.calculationBase,
                rate: nfse.issRate,
                netAmount: nfse.netAmount
            }, AbrasfVersion.V1_0),
            this.buildTagWithValue('ItemListaServico', nfse.serviceCode),
            this.buildTagWithValue('CodigoCnae', nfse.cnaeCode),
            this.buildTagWithValue('CodigoTributacaoMunicipio', nfse.cityTaxCode),
            this.buildTagWithValue('Discriminacao', nfse.description, { clean: true, cdata: true }),
            this.buildTagWithValue('MunicipioPrestacaoServico', nfse.serviceCity),
            '</Servico>'
        ].join('');
    }

    private buildServiceV204(nfse: Nfse): string {
        return [
            '<Servico>',
            this.buildValuesTag({
                serviceAmount: nfse.serviceAmount,
                deductions: nfse.unconditionalDiscount,
                pis: nfse.pisAmount,
                cofins: nfse.cofinsAmount,
                inss: nfse.inssAmount,
                ir: nfse.irAmount,
                csll: nfse.csllAmount,
                issRetention: nfse.issRetention,
                issAmount: nfse.issAmount,
                issRetentionAmount: nfse.issRetention ? nfse.issAmount : 0,
                otherRetentions: nfse.otherRetentions,
                baseCalculation: nfse.calculationBase,
                rate: nfse.issRate,
                netAmount: nfse.netAmount,
                unconditionalDiscount: nfse.unconditionalDiscount,
                conditionalDiscount: nfse.conditionalDiscount
            }, AbrasfVersion.V2_04),
            this.buildTagWithValue('ItemListaServico', nfse.serviceCode),
            this.buildTagWithValue('CodigoCnae', nfse.cnaeCode),
            this.buildTagWithValue('CodigoTributacaoMunicipio', nfse.cityTaxCode),
            this.buildTagWithValue('Discriminacao', nfse.description, { clean: true, cdata: true }),
            this.buildTagWithValue('CodigoMunicipio', nfse.serviceCity),
            this.buildTagWithValue('ExigibilidadeISS', '1'),
            this.buildTagWithValue('MunicipioIncidencia', nfse.incidenceCity),
            '</Servico>'
        ].join('');
    }

    private buildPrestadorV1(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        return [
            '<Prestador>',
            this.buildTagWithValue('Cnpj', nfse.businessId.toString(), { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', cityConfig.getSpecificField('inscricaoMunicipal', '')),
            '</Prestador>'
        ].join('');
    }

    private buildPrestadorV204(nfse: Nfse, cityConfig: NfseCityConfiguration): string {
        return [
            '<Prestador>',
            this.buildTagWithValue('CpfCnpj', nfse.businessId.toString(), { clean: true }),
            this.buildTagWithValue('InscricaoMunicipal', cityConfig.getSpecificField('inscricaoMunicipal', '')),
            '</Prestador>'
        ].join('');
    }

    private buildTomadorV1(nfse: Nfse): string {
        return [
            '<Tomador>',
            '<IdentificacaoTomador>',
            this.buildCpfCnpj(nfse.personId.toString()),
            '</IdentificacaoTomador>',
            '</Tomador>'
        ].join('');
    }

    private buildTomadorV204(nfse: Nfse): string {
        return [
            '<TomadorServico>',
            '<IdentificacaoTomador>',
            this.buildCpfCnpj(nfse.personId.toString()),
            '</IdentificacaoTomador>',
            '</TomadorServico>'
        ].join('');
    }
}