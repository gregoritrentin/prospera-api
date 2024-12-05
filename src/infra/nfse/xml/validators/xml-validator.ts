import { Injectable, Logger } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProcessRpsError } from '@/core/types/nfse/process-rps-error';

@Injectable()
export class XsdValidator {
    private readonly logger = new Logger(XsdValidator.name);
    private readonly schemas: Map<string, string> = new Map();
    private readonly parser: XMLParser;

    constructor() {
        this.loadSchemas();
        this.parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            parseTagValue: true
        });
    }

    private loadSchemas() {
        try {
            // Carrega os schemas XSD na inicialização
            const v1Path = join(__dirname, '../schemas/v1.0/nfse.xsd');
            const v2Path = join(__dirname, '../schemas/v2.04/nfse.xsd');
            const xmldsigPath = join(__dirname, '../schemas/xmldsig-core-schema20020212.xsd');

            this.schemas.set('v1.0', readFileSync(v1Path, 'utf-8'));
            this.schemas.set('v2.04', readFileSync(v2Path, 'utf-8'));
            this.schemas.set('xmldsig', readFileSync(xmldsigPath, 'utf-8'));

            this.logger.log('XSD Schemas loaded successfully');
        } catch (error) {
            this.logger.error('Error loading XSD schemas', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    validate(xml: string, version: 'v1.0' | 'v2.04'): ProcessRpsError[] {
        try {
            const errors: ProcessRpsError[] = [];

            // Validação de XML bem formado
            if (!this.isWellFormedXml(xml)) {
                errors.push({
                    code: 'MALFORMED_XML',
                    message: 'XML is not well formed',
                    solution: 'Check XML syntax and structure'
                });
                return errors;
            }

            // Validação contra o schema XSD
            const schemaErrors = this.validateAgainstSchema(xml, version);
            if (schemaErrors.length > 0) {
                return schemaErrors;
            }

            // Validação de assinatura digital
            const signatureErrors = this.validateXmlSignature(xml);
            if (signatureErrors.length > 0) {
                errors.push(...signatureErrors);
            }

            // Validação de campos obrigatórios específicos
            const fieldErrors = this.validateRequiredFields(xml);
            if (fieldErrors.length > 0) {
                errors.push(...fieldErrors);
            }

            return errors;
        } catch (error) {
            this.logger.error('Error validating XML', {
                version,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return [{
                code: 'VALIDATION_ERROR',
                message: 'Error during XML validation',
                solution: 'Contact support if the error persists'
            }];
        }
    }

    private isWellFormedXml(xml: string): boolean {
        try {
            const result = XMLValidator.validate(xml, {
                allowBooleanAttributes: true
            });
            return result === true;
        } catch (error) {
            this.logger.warn('XML malformed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return false;
        }
    }

    private validateAgainstSchema(xml: string, version: string): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];
        const schema = this.schemas.get(version);

        if (!schema) {
            errors.push({
                code: 'SCHEMA_NOT_FOUND',
                message: `Schema version ${version} not found`,
                solution: 'Use a supported schema version (v1.0 or v2.04)'
            });
            return errors;
        }

        try {
            // Validação contra o schema XSD usando libxmljs ou similar
            // Aqui você precisará implementar a lógica real de validação XSD
            // Este é apenas um exemplo da estrutura
            const validationResult = this.validateXsd(xml, schema);

            if (!validationResult.isValid) {
                validationResult.errors.forEach(error => {
                    errors.push({
                        code: 'SCHEMA_VALIDATION_ERROR',
                        message: error.message,
                        location: error.path,
                        solution: this.getSolutionForSchemaError(error.code)
                    });
                });
            }
        } catch (error) {
            this.logger.error('Error validating against schema', {
                version,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            errors.push({
                code: 'SCHEMA_VALIDATION_ERROR',
                message: 'Error validating XML against schema',
                solution: 'Check if XML follows the ABRASF specification'
            });
        }

        return errors;
    }

    private validateXmlSignature(xml: string): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];

        try {
            const parsedXml = this.parser.parse(xml);

            // Verifica se existe o elemento Signature
            if (!this.hasSignatureElement(parsedXml)) {
                errors.push({
                    code: 'MISSING_SIGNATURE',
                    message: 'XML signature is missing',
                    solution: 'Sign the XML using a valid digital certificate'
                });
                return errors;
            }

            // Aqui você implementaria a validação real da assinatura
            // usando uma biblioteca como xmldsig ou similar

        } catch (error) {
            this.logger.error('Error validating XML signature', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            errors.push({
                code: 'SIGNATURE_VALIDATION_ERROR',
                message: 'Error validating XML signature',
                solution: 'Check if the signature is valid and uses a trusted certificate'
            });
        }

        return errors;
    }

    private validateRequiredFields(xml: string): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];

        try {
            const parsedXml = this.parser.parse(xml);

            // Valida campos obrigatórios específicos da NFSe
            const requiredFields = this.getRequiredFieldsForDocumentType(parsedXml);

            requiredFields.forEach(field => {
                if (!this.hasField(parsedXml, field.path)) {
                    errors.push({
                        code: 'MISSING_REQUIRED_FIELD',
                        message: `Required field ${field.name} is missing`,
                        location: field.path,
                        solution: field.solution
                    });
                }
            });

        } catch (error) {
            this.logger.error('Error validating required fields', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            errors.push({
                code: 'FIELD_VALIDATION_ERROR',
                message: 'Error validating required fields',
                solution: 'Check if all required fields are present in the XML'
            });
        }

        return errors;
    }

    private hasSignatureElement(parsedXml: any): boolean {
        // Implementar verificação do elemento Signature
        return true; // Placeholder
    }

    private hasField(parsedXml: any, path: string): boolean {
        // Implementar verificação de campo usando o path
        return true; // Placeholder
    }

    private getRequiredFieldsForDocumentType(parsedXml: any): Array<{
        name: string;
        path: string;
        solution: string;
    }> {
        // Implementar retorno dos campos obrigatórios baseado no tipo de documento
        return []; // Placeholder
    }

    private getSolutionForSchemaError(code: string): string {
        // Implementar sugestões de solução baseadas no código de erro
        return 'Check the ABRASF documentation for the correct format'; // Placeholder
    }

    private validateXsd(xml: string, schema: string): {
        isValid: boolean;
        errors: Array<{
            code: string;
            message: string;
            path: string;
        }>;
    } {
        // Implementar validação real contra XSD
        return {
            isValid: true,
            errors: []
        }; // Placeholder
    }
}