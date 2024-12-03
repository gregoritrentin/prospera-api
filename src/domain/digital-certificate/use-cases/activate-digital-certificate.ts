import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DigitalCertificate, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';

interface ActivateDigitalCertificateUseCaseRequest {
    businessId: string;
    certificateId: string;
}

type ActivateDigitalCertificateUseCaseResponse = Either<
    AppError,
    {
        certificate: DigitalCertificate;
        message: string;
    }
>;

@Injectable()
export class ActivateDigitalCertificateUseCase {
    constructor(
        private digitalCertificateRepository: DigitalCertificateRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: ActivateDigitalCertificateUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<ActivateDigitalCertificateUseCaseResponse> {
        // Busca o certificado que queremos ativar
        const certificate = await this.digitalCertificateRepository.findById(
            request.certificateId,
            request.businessId
        );

        if (!certificate) {
            return left(AppError.resourceNotFound('errors.CERTIFICATE_NOT_FOUND'))
        }

        // Verifica se o certificado pertence ao business
        if (request.businessId !== certificate.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        // Verifica se o certificado pode ser ativado
        // if (certificate.isExpired()) {
        //     return left(AppError.invalidState('errors.CERTIFICATE_EXPIRED'));
        // }

        // Desativa todos os outros certificados do business
        await this.digitalCertificateRepository.deactivateAllFromBusiness(request.businessId);

        // Ativa o certificado selecionado
        certificate.markAsInstalled();

        // Salva as alterações
        await this.digitalCertificateRepository.save(certificate);

        return right({
            certificate,
            message: this.i18nService.translate('messages.CERTIFICATE_ACTIVATED', language)
        });
    }
}