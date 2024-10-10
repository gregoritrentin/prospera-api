import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BoletoProvider } from '@/domain/interfaces/boleto-provider';
import { BoletoRepository } from '@/domain/transaction/repositories/boleto-repository';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Either, left, right } from '@/core/either';

interface PrintBoletoJobData {
    businessId: string;
    boletoId: string;
    language?: Language;
}

type PrintBoletoResult = Either<
    AppError,
    {
        pdfUrl: string;
    }
>;

@Injectable()
@Processor('boleto')
export class BoletoQueueConsumer {
    private readonly logger = new Logger(BoletoQueueConsumer.name);

    constructor(
        private boletoProvider: BoletoProvider,
        private boletoRepository: BoletoRepository,
        private uploadAndCreateFileUseCase: UploadAndCreateFileUseCase,
        private i18n: I18nService
    ) { }

    @Process('print-boleto')
    async handlePrintBoleto(job: Job<PrintBoletoJobData>): Promise<PrintBoletoResult> {
        this.logger.log(`Processing print boleto job ${job.id}`);
        const { businessId, boletoId, language = 'pt-BR' } = job.data;

        try {
            const boleto = await this.boletoRepository.findById(boletoId, businessId);

            if (!boleto) {
                return left(AppError.resourceNotFound('errois.RESOURCE_NOT_FOUND'));

            }

            if (!boleto.digitableLine) {
                return left(AppError.badRequest(
                    this.i18n.translate('errors.MISSING_DIGITABLE_LINE', language)
                ));
            }

            const pdfBuffer = await this.boletoProvider.printBoleto(boleto.digitableLine);

            const uploadResult = await this.uploadAndCreateFileUseCase.execute({
                businessId: boleto.businessId.toString(),
                folderName: 'boletos',
                fileName: `boleto_${boleto.id}.pdf`,
                fileType: 'application/pdf',
                body: pdfBuffer,
            });

            if (uploadResult.isLeft()) {
                return left(AppError.internalServerError(
                    this.i18n.translate('errors.FILE_UPLOAD_FAILED', language)
                ));
            }

            const { file } = uploadResult.value;

            boleto.pdfFileId = file.id.toString();
            await this.boletoRepository.save(boleto);

            this.logger.log(`Boleto printed successfully. Job ID: ${job.id}`);
            return right({
                pdfUrl: file.url.toString(),
            });

        } catch (error) {
            this.logger.error(`Error processing print boleto job ${job.id}:`, error);
            return left(AppError.boletoCreationFailed({
                message: this.i18n.translate('errors.BOLETO_PRINT_FAILED', language, {
                    errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
                })
            }));
        }
    }
}