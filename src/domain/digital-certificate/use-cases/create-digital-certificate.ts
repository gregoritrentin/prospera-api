import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DigitalCertificate, CertificateSource, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateDigitalCertificateUseCaseRequest {
    businessId: string;
    certificateFile: Buffer;
    password: string;
    serialNumber: string;
    thumbprint: string;
    issueDate: Date;
    expirationDate: Date;
    source: CertificateSource;
    language?: Language;
}

type CreateDigitalCertificateUseCaseResponse = Either<
    AppError,
    {
        certificate: DigitalCertificate;
        message: string;
    }
>;

@Injectable()
export class CreateDigitalCertificateUseCase {
    constructor(
        private digitalCertificateRepository: DigitalCertificateRepository,
        private uploadAndCreateFileUseCase: UploadAndCreateFileUseCase,
        private i18nService: I18nService
    ) { }

    async execute(
        request: CreateDigitalCertificateUseCaseRequest,
        language: string | Language = 'pt-BR'
    ): Promise<CreateDigitalCertificateUseCaseResponse> {
        try {
            // 1. Upload do arquivo do certificado
            const uploadResult = await this.uploadAndCreateFileUseCase.execute({
                businessId: request.businessId,
                folderName: 'certificates',
                fileName: `certificate_${request.serialNumber}.pfx`,
                fileType: 'application/x-pkcs12',
                body: request.certificateFile,
            });

            if (uploadResult.isLeft()) {
                return left(AppError.internalServerError(
                    this.i18nService.translate('errors.CERTIFICATE_UPLOAD_FAILED', language)
                ));
            }

            const { file } = uploadResult.value;

            // 2. Criar o certificado digital
            const certificate = DigitalCertificate.create({
                businessId: new UniqueEntityID(request.businessId),
                certificateFileId: new UniqueEntityID(file.id.toString()),
                source: request.source,
                serialNumber: request.serialNumber,
                thumbprint: request.thumbprint,
                password: request.password,
                issueDate: request.issueDate,
                expirationDate: request.expirationDate,
                status: CertificateStatus.PENDING_VALIDATION,
            });

            // 3. Salvar no repositório
            await this.digitalCertificateRepository.create(certificate);

            return right({
                certificate,
                message: this.i18nService.translate('messages.CERTIFICATE_CREATED', language)
            });

        } catch (error) {
            return left(AppError.internalServerError(
                this.i18nService.translate('errors.CERTIFICATE_CREATION_FAILED', language, {
                    errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
                })
            ));
        }
    }
}