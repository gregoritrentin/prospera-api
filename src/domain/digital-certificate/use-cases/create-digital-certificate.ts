import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DigitalCertificate, CertificateSource, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { DigitalCertificateProvider } from '@/domain/interfaces/digital-certificate-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError, ErrorCode } from '@/core/errors/app-errors';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateDigitalCertificateUseCaseRequest {
    businessId: string;
    certificateFile: Buffer;
    password: string;
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
        private digitalCertificateProvider: DigitalCertificateProvider,
        private uploadAndCreateFileUseCase: UploadAndCreateFileUseCase,
        private i18nService: I18nService
    ) { }

    async execute(
        request: CreateDigitalCertificateUseCaseRequest,
        language: string | Language = 'pt-BR'
    ): Promise<CreateDigitalCertificateUseCaseResponse> {
        try {
            // 1. Validar se já existe certificado ativo
            const existingActiveCertificate = await this.digitalCertificateRepository.findUniqueActive(
                request.businessId
            );

            if (existingActiveCertificate) {
                return left(AppError.activeCertificateExists({
                    message: this.i18nService.translate('errors.ACTIVE_CERTIFICATE_EXISTS', language)
                }));
            }

            // 2. Ler e validar o certificado digital
            const certificateResult = await this.digitalCertificateProvider.readCertificateInfo(
                request.certificateFile,
                request.password
            );

            if (certificateResult.isLeft()) {
                const error = certificateResult.value;

                // Mapear erros específicos do certificado
                if (error.errorCode === ErrorCode.CERTIFICATE_FORMAT_INVALID) {
                    return left(AppError.certificateFormatInvalid({
                        message: this.i18nService.translate('errors.CERTIFICATE_FORMAT_INVALID', language)
                    }));
                }

                if (error.errorCode === ErrorCode.CERTIFICATE_PASSWORD_INVALID) {
                    return left(AppError.certificatePasswordInvalid({
                        message: this.i18nService.translate('errors.CERTIFICATE_PASSWORD_INVALID', language)
                    }));
                }

                return left(AppError.certificateValidationFailed({
                    message: this.i18nService.translate('errors.CERTIFICATE_VALIDATION_FAILED', language),
                    details: error.details
                }));
            }

            const certificateInfo = certificateResult.value;

            // 3. Verificar se já existe um certificado com o mesmo número serial
            const existingCertificate = await this.digitalCertificateRepository.findBySerialNumber(
                certificateInfo.serialNumber,
                request.businessId
            );

            if (existingCertificate) {
                return left(AppError.certificateAlreadyExists({
                    serialNumber: certificateInfo.serialNumber,
                    message: this.i18nService.translate('errors.CERTIFICATE_ALREADY_EXISTS', language)
                }));
            }

            // 4. Validar data de expiração
            if (certificateInfo.expirationDate <= new Date()) {
                return left(AppError.certificateExpired({
                    expirationDate: certificateInfo.expirationDate,
                    message: this.i18nService.translate('errors.CERTIFICATE_EXPIRED', language)
                }));
            }

            // 5. Upload do arquivo do certificado
            const uploadResult = await this.uploadAndCreateFileUseCase.execute({
                businessId: request.businessId,
                folderName: 'certificates',
                fileName: `certificate_${certificateInfo.serialNumber}.pfx`,
                fileType: 'application/x-pkcs12',
                body: request.certificateFile,
            });

            if (uploadResult.isLeft()) {
                return left(AppError.certificateUploadFailed({
                    reason: uploadResult.value.message,
                    message: this.i18nService.translate('errors.CERTIFICATE_UPLOAD_FAILED', language)
                }));
            }

            const { file } = uploadResult.value;

            // 6. Criar o certificado digital
            const certificate = DigitalCertificate.create({
                businessId: new UniqueEntityID(request.businessId),
                certificateFileId: new UniqueEntityID(file.id.toString()),
                source: CertificateSource.EXTERNAL,
                serialNumber: certificateInfo.serialNumber,
                thumbprint: certificateInfo.thumbprint,
                password: request.password,
                issueDate: certificateInfo.issueDate,
                expirationDate: certificateInfo.expirationDate,
                status: CertificateStatus.PENDING_VALIDATION,
            });

            // 7. Salvar no repositório
            try {
                await this.digitalCertificateRepository.create(certificate);
            } catch (error) {
                return left(AppError.certificateCreationFailed({
                    error: error instanceof Error ? error.message : 'Unknown error',
                    message: this.i18nService.translate('errors.CERTIFICATE_CREATION_FAILED', language)
                }));
            }

            // 8. Retornar sucesso
            return right({
                certificate,
                message: this.i18nService.translate('messages.CERTIFICATE_CREATED', language)
            });

        } catch (error) {
            console.error('[CreateDigitalCertificateUseCase] Error:', error);

            return left(AppError.certificateCreationFailed({
                error: error instanceof Error ? error.message : 'Unknown error',
                message: this.i18nService.translate('errors.CERTIFICATE_CREATION_FAILED', language)
            }));
        }
    }
}