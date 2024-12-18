import { Injectable, Logger } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event';
import { NfseEventType, NfseEventStatus, NfseStatus } from '@/core/types/enums';
import { ProcessRpsRequest } from '@/core/types/nfse/process-rps-request';
import { ProcessRpsResponse } from '@/core/types/nfse/process-rps-response';
import { ProcessRpsError } from '@/core/types/nfse/process-rps-error';
import { ProcessRpsWarning } from '@/core/types/nfse/process-rps-warning';
import { AppError } from '@/core/errors/app-errors';
import { Either, left, right } from '@/core/either';
import { InfNfse, NfseXmlResponse } from '@/core/types/nfse/xml-types';

@Injectable()
export class RpsResponseProcessor {
    private readonly logger = new Logger(RpsResponseProcessor.name);

    async processResponse(request: ProcessRpsRequest): Promise<Either<AppError, ProcessRpsResponse>> {
        try {
            // 1. Limpar o XML (remover CDATA, etc)
            const cleanXml = this.cleanXml(request.xml);

            // 2. Converter XML para objeto
            const parsedXml = await this.parseXml(cleanXml);
            if (!parsedXml) {
                return left(AppError.validationError('errors.INVALID_XML_RESPONSE'));
            }

            // 3. Verificar se há erros na resposta
            const errors = this.extractErrors(parsedXml);
            if (errors.length > 0) {
                const response = this.createErrorResponse(errors, request.xml);
                return right(response);
            }

            // 4. Verificar se há alertas
            const warnings = this.extractWarnings(parsedXml);

            // 5. Extrair dados da NFSe
            const nfseData = this.extractNfseData(parsedXml);
            if (!nfseData) {
                const response = this.createErrorResponse(
                    [{ code: 'PARSE_ERROR', message: 'Could not extract NFSe data' }],
                    request.xml
                );
                return right(response);
            }

            // 6. Validar dados extraídos
            const validationResult = this.validateNfseData(nfseData);
            if (validationResult !== true) {
                return left(validationResult);
            }

            // 7. Criar resposta de sucesso
            const response: ProcessRpsResponse = {
                success: true,
                message: 'NFSe processed successfully',
                protocol: nfseData.protocol,
                nfseNumber: nfseData.number,
                verificationCode: nfseData.verificationCode,
                issueDate: nfseData.issueDate,
                data: {
                    situation: nfseData.situation,
                    serviceAmount: nfseData.serviceAmount,
                    baseCalculation: nfseData.baseCalculation,
                    issAmount: nfseData.issAmount,
                    issRate: nfseData.issRate,
                    deductions: nfseData.deductions,
                    netAmount: nfseData.netAmount
                },
                warnings,
                xml: request.xml
            };

            // 8. Validar resposta final
            const responseValidation = this.validateResponse(response);
            if (responseValidation !== true) {
                return left(responseValidation);
            }

            return right(response);

        } catch (error) {
            this.logger.error('Error processing RPS response', {
                error: error instanceof Error ? error.message : 'Unknown error',
                businessId: request.businessId,
                nfseId: request.nfseId
            });

            return left(AppError.internalServerError('errors.PROCESS_ERROR'));
        }
    }

    private cleanXml(xml: string): string {
        return xml
            .replace(/<!\[CDATA\[/g, '')
            .replace(/\]\]>/g, '')
            .replace(/&amp;#13;/g, '')
            .replace(/&amp;/g, '&')
            .replace(/<soap:.*?>/g, '');
    }

    private async parseXml(xml: string): Promise<any> {
        try {
            return await parseStringPromise(xml, {
                explicitArray: false,
                ignoreAttrs: true,
                trim: true
            });
        } catch (error) {
            this.logger.error('Error parsing XML', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return null;
        }
    }

    private extractErrors(parsedXml: any): ProcessRpsError[] {
        const errors: ProcessRpsError[] = [];
        const errorPaths = [
            'ConsultarNfseRpsResposta.ListaMensagemRetorno.MensagemRetorno',
            'EnviarLoteRpsResposta.ListaMensagemRetorno.MensagemRetorno'
        ];

        for (const path of errorPaths) {
            const error = this.getNestedValue(parsedXml, path);
            if (error) {
                if (Array.isArray(error)) {
                    errors.push(...error.map(e => ({
                        code: e.Codigo,
                        message: e.Mensagem,
                        location: e.Correcao
                    })));
                } else {
                    errors.push({
                        code: error.Codigo,
                        message: error.Mensagem,
                        location: error.Correcao
                    });
                }
            }
        }

        return errors;
    }

    private extractWarnings(parsedXml: any): ProcessRpsWarning[] {
        const warnings: ProcessRpsWarning[] = [];
        const alertas = this.getNestedValue(parsedXml, 'ListaMensagemAlerta.Alerta');

        if (alertas) {
            if (Array.isArray(alertas)) {
                warnings.push(...alertas.map(a => ({
                    code: a.Codigo,
                    message: a.Mensagem,
                    type: this.determineWarningType(a.Codigo)
                })));
            } else {
                warnings.push({
                    code: alertas.Codigo,
                    message: alertas.Mensagem,
                    type: this.determineWarningType(alertas.Codigo)
                });
            }
        }

        return warnings;
    }

    private extractNfseData(parsedXml: NfseXmlResponse): any {
        let nfse: InfNfse | null = null;

        if (parsedXml.ConsultarNfseRpsResposta?.CompNfse) {
            nfse = parsedXml.ConsultarNfseRpsResposta.CompNfse.Nfse.InfNfse;
        } else if (parsedXml.EnviarLoteRpsResposta?.ListaNfse?.CompNfse) {
            nfse = parsedXml.EnviarLoteRpsResposta.ListaNfse.CompNfse.Nfse.InfNfse;
        }

        if (!nfse) return null;

        const values = nfse.Servico?.Valores;

        return {
            number: nfse.Numero,
            protocol: nfse.CodigoVerificacao,
            verificationCode: nfse.CodigoVerificacao,
            issueDate: new Date(nfse.DataEmissao),
            situation: this.determineNfseSituation(nfse),
            serviceAmount: this.parseDecimal(values?.ValorServicos),
            baseCalculation: this.parseDecimal(values?.BaseCalculo),
            issAmount: this.parseDecimal(values?.ValorIss),
            issRate: this.parseDecimal(values?.Aliquota),
            deductions: this.parseDecimal(values?.ValorDeducoes),
            netAmount: this.parseDecimal(values?.ValorLiquidoNfse)
        };
    }

    private createErrorResponse(
        errors: ProcessRpsError[],
        xml: string
    ): ProcessRpsResponse {
        return {
            success: false,
            message: errors.map(e => e.message).join('; '),
            errors,
            xml
        };
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) =>
            current && current[key] ? current[key] : null, obj);
    }

    private parseDecimal(value: string | null | undefined): number {
        if (!value) return 0;
        return parseFloat(value.replace(',', '.')) || 0;
    }

    private determineWarningType(code: string): 'INFO' | 'ALERT' | 'WARNING' {
        if (code.startsWith('I')) return 'INFO';
        if (code.startsWith('A')) return 'ALERT';
        return 'WARNING';
    }

    private determineNfseSituation(nfse: any): string {
        if (nfse.NfseCancelamento) return 'CANCELED';
        if (nfse.NfseSubstituicao) return 'REPLACED';
        return 'NORMAL';
    }

    private validateNfseData(data: any): AppError | true {
        if (!data.number) {
            return AppError.validationError('errors.MISSING_NFSE_NUMBER');
        }

        if (!data.protocol) {
            return AppError.validationError('errors.MISSING_PROTOCOL');
        }

        // if (!data.issueDate || isNaN(data.issueDate.getTime())) {
        //     return AppError.invalidDate('errors.INVALID_ISSUE_DATE');
        // }

        // if (data.serviceAmount < 0) {
        //     return AppError.invalidAmount('errors.INVALID_SERVICE_AMOUNT');
        // }

        // if (data.baseCalculation < 0) {
        //     return AppError.invalidAmount('errors.INVALID_CALCULATION_BASE');
        // }

        return true;
    }

    private validateResponse(response: ProcessRpsResponse): AppError | true {
        if (!response.success && !response.errors?.length) {
            return AppError.validationError('errors.INVALID_RESPONSE_STATUS');
        }

        if (response.success && (!response.nfseNumber || !response.protocol)) {
            return AppError.validationError('errors.MISSING_REQUIRED_FIELDS');
        }

        return true;
    }
}