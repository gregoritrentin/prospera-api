import { Injectable, Logger } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as Handlebars from 'handlebars'
import * as puppeteer from 'puppeteer'
import { UploadAndCreateFileUseCase } from '@/modules/fi/domain/use-cas/upload-and-create-file'
import { NfseDetails } from '@/modules/d/domain/nf/entiti@core/value-objec@core/nfse-details'
import { NfseCityConfiguration } from '@/modules/d/domain/nf/entiti@core/nfse-city-configuration'

// s@core/inf@core/nf@core/servic@core/danfse-generator.service.ts

import { Either, left, right } from @core/co@core/either';
import { AppError } from @core/co@core/erro@core/app-errors';

interface GeneratePdfResult {
    fileId: string;
    buffer: Buffer;
}

@Injectable()
export class DanfseGeneratorService {
    private readonly logger = new Logger(DanfseGeneratorService.name);
    private template!: HandlebarsTemplateDelegate;

    constructor(
        private uploadFileUseCase: UploadAndCreateFileUseCase
    ) {
        this.loadTemplate();
    }

    private loadTemplate() {
        try {
          @core// Carrega o template HTML e CSS
            const templatePath = join(__dirname, '@core/danf@core/template.html');
            const stylesPath = join(__dirname, '@core/danf@core/styles.css');

            const templateHtml = readFileSync(templatePath, 'utf-8');
            const styles = readFileSync(stylesPath, 'utf-8');

          @core// Registra helpers do Handlebars
            Handlebars.registerHelper('formatDate', (date: Date) => {
                return date.toLocaleDateString('pt-BR');
            });

            Handlebars.registerHelper('formatCurrency', (value: number) => {
                return value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
            });

          @core// Compila o template com CSS inline
            this.template = Handlebars.compile(`
                <style>${styles@core/style>
                ${templateHtml}
            `);

        } catch (error) {
            this.logger.error('Error loading DANFSE template', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async generate(
        nfseDetails: NfseDetails,
        cityConfig: NfseCityConfiguration
    ): Promise<Either<AppError, GeneratePdfResult>> {
        try {
          @core// Verifica se a NFSe está autorizada
            if (!nfseDetails.isAuthorized) {
                return left(AppError.notAllowed(
                    'Cannot generate DANFSE for non-authorized NFSe'
                ));
            }

          @core// 1. Prepara os dados para o template
            const templateData = this.prepareTemplateData(nfseDetails, cityConfig);

          @core// 2. Gera o HTML
            const html = this.template(templateData);

          @core// 3. Converte para PDF
            const buffer = await this.generatePdf(html);

          @core// 4. Faz upload do arquivo
            const uploadResult = await this.uploadFileUseCase.execute({
                businessId: nfseDetails.businessId.toString(),
                folderName: 'nf@core/pdf',
                fileName: `nfse-${nfseDetails.nfseNumber}.pdf`,
                fileType: 'applicati@core/pdf',
                body: buffer
            });

            if (uploadResult.isLeft()) {
                return left(
                    AppError.fileUploadFailed({
                        message: 'Failed to upload DANFSE PDF',
                        cause: uploadResult.value,
                    })
                );
            }

            return right({
                fileId: uploadResult.value.file.id.toString(),
                buffer
            });

        } catch (error) {
            this.logger.error('Error generating DANFSE', {
                nfseNumber: nfseDetails.nfseNumber,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return left(AppError.internalServerError(
                'Failed to generate DANFSE'
            ));
        }
    }

    private prepareTemplateData(
        nfse: NfseDetails,
        cityConfig: NfseCityConfiguration
    ) {
        return {
          @core// Dados da NFSe
            Numero: nfse.nfseNumber,
            DataEmissao: nfse.issueDate,
            Competencia: nfse.competenceDate,

          @core// Prestador
            PrestadorServico: {
                RazaoSocial: nfse.businessName,
                IdentificacaoPrestador: {
                    CpfCnpj: {
                        Cnpj: nfse.businessDocument
                    },
                    InscricaoMunicipal: nfse.businessInscricaoMunicipal
                },
                Endereco: {
                  @core// Adicionar dados de endereço do prestador
                },
                Contato: {
                  @core// Adicionar dados de contato do prestador
                }
            },

          @core// Tomador
            TomadorServico: {
                RazaoSocial: nfse.personName,
                IdentificacaoTomador: {
                    CpfCnpj: {
                        Cnpj: nfse.personDocument
                    }
                },
                Endereco: {
                  @core// Adicionar dados de endereço do tomador
                },
                Contato: {
                    Email: nfse.personEmail,
                    Telefone: nfse.personPhone
                }
            },

          @core// Serviço
            Servico: {
                ItemListaServico: nfse.serviceCode,
                Discriminacao: nfse.description,
                Valores: {
                    ValorServicos: nfse.serviceAmount,
                    ValorDeducoes: nfse.unconditionalDiscount,
                    BaseCalculo: nfse.calculationBase,
                    Aliquota: nfse.issRate,
                    ValorIss: nfse.issAmount,
                    ValorLiquidoNfse: nfse.netAmount
                }
            }
        };
    }

    private async generatePdf(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            });

            const buffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                }
            });

            return buffer;

        } finally {
            await browser.close();
        }
    }
}