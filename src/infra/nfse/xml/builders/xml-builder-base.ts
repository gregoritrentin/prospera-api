// src/infra/nfse/xml/builders/xml-builder-base.ts
import { Injectable, Logger } from '@nestjs/common';
import { XsdValidator } from '../validators/xsd-validator';
import { ConfigService } from '@nestjs/config';
import { ProcessRpsError } from '@/core/types/nfse/process-rps-error';
import {
    Nfse,
    NfseEvent,
    NfseCityConfiguration
} from '@/domain/dfe/nfse/entities';
import { AbrasfVersion } from '@/core/types/enums';

@Injectable()
export class XmlBuilderBase {
    protected readonly logger = new Logger(XmlBuilderBase.name);
    protected readonly XMLNS = 'http://www.abrasf.org.br/nfse.xsd';

    constructor(
        protected readonly xsdValidator: XsdValidator,
        protected readonly configService: ConfigService
    ) { }

    protected buildXmlHeader(
        rootElement: string,
        version: string,
        includeEncoding = true
    ): string {
        const encoding = includeEncoding ? 'encoding="UTF-8"' : '';
        return `<?xml version="1.0" ${encoding}?>\n<${rootElement} xmlns="${this.XMLNS}" versao="${version}">`;
    }

    protected buildXmlFooter(rootElement: string): string {
        return `</${rootElement}>`;
    }

    protected wrapInCdata(content: string): string {
        return `<![CDATA[${content}]]>`;
    }

    protected formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    protected formatDateTime(date: Date): string {
        return date.toISOString().replace('T', ' ').split('.')[0];
    }

    protected formatCurrency(value: number): string {
        return value.toFixed(2).replace('.', ',');
    }

    protected cleanString(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .trim();
    }

    protected buildTagWithValue(tag: string, value: any, options: {
        clean?: boolean;
        cdata?: boolean;
        optional?: boolean;
    } = {}): string {
        if (value === undefined || value === null || value === '') {
            return options.optional ? '' : `<${tag}/>`;
        }

        let processedValue = value.toString();

        if (options.clean) {
            processedValue = this.cleanString(processedValue);
        }

        if (options.cdata) {
            processedValue = this.wrapInCdata(processedValue);
        }

        return `<${tag}>${processedValue}</${tag}>`;
    }

    protected buildCpfCnpjTag(document: string): string {
        const tag = document.length === 11 ? 'Cpf' : 'Cnpj';
        return this.buildTagWithValue('CpfCnpj',
            this.buildTagWithValue(tag, document, { clean: true })
        );
    }

    protected async validateXml(
        xml: string,
        version: AbrasfVersion,
        operationType: string
    ): Promise<ProcessRpsError[]> {
        try {
            // Normaliza o XML antes da validação
            const normalizedXml = this.normalizeXml(xml);

            // Valida contra o schema XSD
            const errors = await this.xsdValidator.validate(
                normalizedXml,
                version === AbrasfVersion.V1_0 ? 'v1.0' : 'v2.04'
            );

            if (errors.length > 0) {
                this.logger.warn(`XML validation errors for ${operationType}`, { errors });
            }

            return errors;
        } catch (error) {
            this.logger.error(`Error validating ${operationType} XML`, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return [{
                code: 'VALIDATION_ERROR',
                message: `Error validating ${operationType} XML`,
                solution: 'Check XML structure and try again'
            }];
        }
    }

    protected normalizeXml(xml: string): string {
        return xml
            .replace(/>\s+</g, '><')
            .replace(/\r?\n|\r/g, '')
            .replace(/\s+/g, ' ')
            .replace(/>\s+/g, '>')
            .replace(/\s+</g, '<')
            .trim();
    }

    protected buildAddressTag(
        address: {
            street?: string;
            number?: string;
            complement?: string;
            district?: string;
            cityCode?: string;
            state?: string;
            zipCode?: string;
        },
        version: AbrasfVersion
    ): string {
        const tags = [
            this.buildTagWithValue('Endereco', address.street, { clean: true, optional: true }),
            this.buildTagWithValue('Numero', address.number, { clean: true, optional: true }),
            this.buildTagWithValue('Complemento', address.complement, { clean: true, optional: true }),
            this.buildTagWithValue('Bairro', address.district, { clean: true, optional: true }),
            this.buildTagWithValue('CodigoMunicipio', address.cityCode, { clean: true, optional: true }),
            this.buildTagWithValue('Uf', address.state, { clean: true, optional: true }),
            this.buildTagWithValue('Cep', address.zipCode?.replace(/\D/g, ''), { clean: true, optional: true })
        ];

        return `<Endereco>${tags.join('')}</Endereco>`;
    }

    protected buildValuesTag(
        values: {
            serviceAmount: number;
            deductions?: number;
            pis?: number;
            cofins?: number;
            inss?: number;
            ir?: number;
            csll?: number;
            issRetention: boolean;
            issAmount?: number;
            issRetentionAmount?: number;
            otherRetentions?: number;
            baseCalculation?: number;
            rate?: number;
            netAmount?: number;
            unconditionalDiscount?: number;
            conditionalDiscount?: number;
        },
        version: AbrasfVersion
    ): string {
        const tags = [
            this.buildTagWithValue('ValorServicos', this.formatCurrency(values.serviceAmount)),
            this.buildTagWithValue('ValorDeducoes', this.formatCurrency(values.deductions || 0), { optional: true }),
            this.buildTagWithValue('ValorPis', this.formatCurrency(values.pis || 0), { optional: true }),
            this.buildTagWithValue('ValorCofins', this.formatCurrency(values.cofins || 0), { optional: true }),
            this.buildTagWithValue('ValorInss', this.formatCurrency(values.inss || 0), { optional: true }),
            this.buildTagWithValue('ValorIr', this.formatCurrency(values.ir || 0), { optional: true }),
            this.buildTagWithValue('ValorCsll', this.formatCurrency(values.csll || 0), { optional: true }),
            this.buildTagWithValue('IssRetido', values.issRetention ? '1' : '2'),
            this.buildTagWithValue('ValorIss', this.formatCurrency(values.issAmount || 0), { optional: true }),
            this.buildTagWithValue('ValorIssRetido', this.formatCurrency(values.issRetentionAmount || 0), { optional: true }),
            this.buildTagWithValue('OutrasRetencoes', this.formatCurrency(values.otherRetentions || 0), { optional: true }),
            this.buildTagWithValue('BaseCalculo', this.formatCurrency(values.baseCalculation || values.serviceAmount)),
            this.buildTagWithValue('Aliquota', this.formatCurrency(values.rate || 0), { optional: true }),
            this.buildTagWithValue('ValorLiquidoNfse', this.formatCurrency(values.netAmount || values.serviceAmount), { optional: true })
        ];

        if (version === AbrasfVersion.V2_04) {
            tags.push(
                this.buildTagWithValue('DescontoIncondicionado', this.formatCurrency(values.unconditionalDiscount || 0), { optional: true }),
                this.buildTagWithValue('DescontoCondicionado', this.formatCurrency(values.conditionalDiscount || 0), { optional: true })
            );
        }

        return `<Valores>${tags.join('')}</Valores>`;
    }

    protected generateId(prefix: string, value: string): string {
        return `${prefix}_${value}_${Date.now()}`;
    }

    protected getVersionFromConfig(cityConfig: NfseCityConfiguration): string {
        return cityConfig.abrasfVersion === AbrasfVersion.V1_0 ? '1.00' : '2.04';
    }
}