// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { DigitalCertificate, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate';
// import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
// import { CertificateValidatorProvider } from '@/domain/interfaces/certificate-validator-provider';
// import { FileProvider } from '@/domain/interfaces/file-provider';
// import { I18nService, Language } from '@/i18n/i18n.service';
// import { AppError } from '@/core/errors/app-errors';

// interface ValidateDigitalCertificateUseCaseRequest {
//     businessId: string;
//     certificateId: string;
// }

// type ValidateDigitalCertificateUseCaseResponse = Either<
//     AppError,
//     {
//         certificate: DigitalCertificate;
//         message: string;
//     }
// >;

// @Injectable()
// export class ValidateDigitalCertificateUseCase {
//     constructor(
//         private digitalCertificateRepository: DigitalCertificateRepository,
//         private certificateValidator: CertificateValidatorProvider,
//         private fileProvider: FileProvider,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: ValidateDigitalCertificateUseCaseRequest,
//         language: string | Language = 'pt-BR'
//     ): Promise<ValidateDigitalCertificateUseCaseResponse> {
//         try {
//             // 1. Buscar o certificado
//             const certificate = await this.digitalCertificateRepository.findById(
//                 request.certificateId,
//                 request.businessId
//             );

//             if (!certificate) {
//                 return left(AppError.resourceNotFound('errors.CERTIFICATE_NOT_FOUND'));
//             }

//             // 2. Verificar propriedade do certificado
//             if (request.businessId !== certificate.businessId.toString()) {
//                 return left(AppError.notAllowed('errors.NOT_ALLOWED'));
//             }

//             // 3. Baixar o arquivo do certificado
//             const certificateBuffer = await this.fileProvider.downloadFile(
//                 certificate.certificateFileId.toString()
//             );

//             if (!certificateBuffer) {
//                 return left(AppError.resourceNotFound('errors.CERTIFICATE_FILE_NOT_FOUND'));
//             }

//             // 4. Validar o certificado
//             const validationResult = await this.certificateValidator.validate({
//                 certificate: certificateBuffer,
//                 password: certificate.password,
//                 serialNumber: certificate.serialNumber,
//                 thumbprint: certificate.thumbprint
//             });

//             if (!validationResult.isValid) {
//                 certificate.status = CertificateStatus.INVALID;
//                 await this.digitalCertificateRepository.save(certificate);

//                 return left(AppError.invalidState('errors.INVALID_CERTIFICATE', {
//                     reason: validationResult.error
//                 }));
//             }

//             // 5. Atualizar status e informações adicionais do certificado
//             if (certificate.isExpired()) {
//                 certificate.status = CertificateStatus.EXPIRED;
//             } else if (certificate.isExpiring()) {
//                 certificate.status = CertificateStatus.EXPIRING;
//             } else {
//                 certificate.status = CertificateStatus.ACTIVE;
//             }

//             // 6. Salvar as alterações
//             await this.digitalCertificateRepository.save(certificate);

//             return right({
//                 certificate,
//                 message: this.i18nService.translate('messages.CERTIFICATE_VALIDATED', language)
//             });

//         } catch (error) {
//             return left(AppError.internalServerError(
//                 this.i18nService.translate('errors.CERTIFICATE_VALIDATION_FAILED', language, {
//                     errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
//                 })
//             ));
//         }
//     }
// }