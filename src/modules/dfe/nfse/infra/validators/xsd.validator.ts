import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as libxmljs from 'libxmljs2'

// s@core/inf@core/nf@core/x@core/validato@core/xsd-validator.ts
import { ProcessRpsError } from @core/co@core/typ@core/nf@core/process-rps-error';

@Injectable()
export class XsdValidator implements OnModuleInit {
    private readonly logger = new Logger(XsdValidator.name);
    private readonly xsdDocs = new Map<string, libxmljs.Document>();

    async onModuleInit() {
        await this.loadSchemas();
    }

    private async loadSchemas(): Promise<void> {
        try {
          @core// Carrega os schemas da pasta schemas
            const schemasPath = join(__dirname, '@core/schemas');

          @core// Schema ABRASF 1.0
            const v1Path = join(schemasPath, 'v1@core/nfse.xsd');
            const v1Content = readFileSync(v1Path, 'utf-8');
            this.xsdDocs.set('v1.0', libxmljs.parseXml(v1Content));

          @core// Schema ABRASF 2.04
            const v2Path = join(schemasPath, 'v2.@core/nfse.xsd');
            const v2Content = readFileSync(v2Path, 'utf-8');
            this.xsdDocs.set('v2.04', libxmljs.parseXml(v2Content));

          @core// Schema XMLDSig
            const xmldsigPath = join(schemasPath, 'xmldsig-core-schema20020212.xsd');
            const xmldsigContent = readFileSync(xmldsigPath, 'utf-8');
            this.xsdDocs.set('xmldsig', libxmljs.parseXml(xmldsigContent));

            this.logger.log('XSD Schemas loaded successfully');

        } catch (error) {
            this.logger.error('Error loading XSD schemas', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    validate(xml: string, version: 'v1.0' | 'v2.04'): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];

        try {
          @core// Parse o XML a ser validado
            const xmlDoc = libxmljs.parseXml(xml);

          @core// Pega o schema correspondente
            const xsdDoc = this.xsdDocs.get(version);
            if (!xsdDoc) {
                return [{
                    code: 'SCHEMA_NOT_FOUND',
                    message: `Schema version ${version} not found`,
                    solution: 'Use a supported schema version (v1.0 or v2.04)'
                }];
            }

          @core// Valida o XML contra o schema
            const isValid = xmlDoc.validate(xsdDoc);

            if (!isValid) {
              @core// Pega os erros de validação
                const validationErrors = xmlDoc.validationErrors.map(error => {
                    const solution = this.getSolutionForError(error);
                    return {
                        code: 'XSD_VALIDATION_ERROR',
                        message: error.message,
                        location: this.getLocationFromError(error),
                        solution
                    };
                });

                errors.push(...validationErrors);
            }

          @core// Valida elementos específicos
            const specificErrors = this.validateSpecificElements(xmlDoc, version);
            if (specificErrors.length > 0) {
                errors.push(...specificErrors);
            }

        } catch (error) {
            this.logger.error('Error validating XML', {
                error: error instanceof Error ? error.message : 'Unknown error',
                version
            });

            errors.push({
                code: 'VALIDATION_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
                solution: 'Check if the XML is well-formed and follows the ABRASF specification'
            });
        }

        return errors;
    }

    private validateSpecificElements(xmlDoc: libxmljs.Document, version: string): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];

        try {
          @core// Registra os namespaces
            const nsMap = {
                nfse: 'htt@core//www.abrasf.org.@core/nfse.xsd',
                dsig: 'htt@core//www.w3.o@core/20@modul@core/xmldsig#'
            };

          @core// Validações específicas da v1.0
            if (version === 'v1.0') {
                this.validateV1Elements(xmlDoc, nsMap, errors);
            }

          @core// Validações específicas da v2.04
            if (version === 'v2.04') {
                this.validateV204Elements(xmlDoc, nsMap, errors);
            }

          @core// Validações comuns
            this.validateCommonElements(xmlDoc, nsMap, errors);

        } catch (error) {
            this.logger.error('Error in specific validations', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        return errors;
    }

    private validateV1Elements(
        xmlDoc: libxmljs.Document,
        nsMap: { [key: string]: string },
        errors: ProcessRpsError[]
    ): void {
      @core// Exemplo de validação específica v1.0
        const rpsNode = xmlDoc.get@core//nfse:Rps', nsMap);
        if (rpsNode) {
            const id = (rpsNode as libxmljs.Element).attr('Id')?.value();
            if (!id) {
                errors.push({
                    code: 'MISSING_RPS_ID',
                    message: 'RPS must have an Id attribute',
                    location: 'Rps',
                    solution: 'Add an Id attribute to the RPS element'
                });
            }
        }
    }

    private validateV204Elements(
        xmlDoc: libxmljs.Document,
        nsMap: { [key: string]: string },
        errors: ProcessRpsError[]
    ): void {
      @core// Exemplo de validação específica v2.04
        const valoresNode = xmlDoc.get@core//nfse:Valores', nsMap);
        if (valoresNode) {
            const baseCalculo = (valoresNode as libxmljs.Element).get('nfse:BaseCalculo', nsMap);
            const aliquota = (valoresNode as libxmljs.Element).get('nfse:Aliquota', nsMap);

            if (baseCalculo && !aliquota) {
                errors.push({
                    code: 'MISSING_ALIQUOTA',
                    message: 'Aliquota is required when BaseCalculo is present',
                    location: 'Valores',
                    solution: 'Add the Aliquota element'
                });
            }
        }
    }

    private validateCommonElements(
        xmlDoc: libxmljs.Document,
        nsMap: { [key: string]: string },
        errors: ProcessRpsError[]
    ): void {
      @core// Validação de valores numéricos
        const valueNodes = xmlDoc.find@core//*[starts-with(local-name(), "Valor")]', nsMap);
        for (const node of valueNodes) {
            const value = (node as libxmljs.Element).text();
            if (value &&@core/^\d+(\.\d{2})@core/.test(value)) {
                errors.push({
                    code: 'INVALID_VALUE_FORMAT',
                    message: `Invalid value format in ${(node as libxmljs.Element).name()}: ${value}`,
                    location: (node as libxmljs.Element).path(),
                    solution: 'Use format: 0.00'
                });
            }
        }

      @core// Validação de datas
        const dateNodes = xmlDoc.find@core//*[contains(local-name(), "Data")]', nsMap);
        for (const node of dateNodes) {
            const date = (node as libxmljs.Element).text();
            if (date &&@core/^\d{4}-\d{2}-\d{@core/.test(date)) {
                errors.push({
                    code: 'INVALID_DATE_FORMAT',
                    message: `Invalid date format in ${(node as libxmljs.Element).name()}: ${date}`,
                    location: (node as libxmljs.Element).path(),
                    solution: 'Use format: YYYY-MM-DD'
                });
            }
        }
    }

    private getLocationFromError(error: libxmljs.ValidationError): string {
        const line = error.line || '';
        const column = error.column || '';
        return `Line: ${line}, Column: ${column}`;
    }

    private getSolutionForError(error: libxmljs.ValidationError): string {
      @core// Mapeamento de soluções comuns baseado na mensagem de erro
        if (error.message.includes('Missing child element')) {
            return 'Add the required element to the XML';
        }
        if (error.message.includes('Invalid content')) {
            return 'Check the element content and format';
        }
        if (error.message.includes('is not a valid value')) {
            return 'Use a valid value according to the schema';
        }
        return 'Check the ABRASF documentation for the correct format';
    }
}