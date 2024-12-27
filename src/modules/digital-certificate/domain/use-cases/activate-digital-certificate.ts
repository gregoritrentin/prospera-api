import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { DigitalCertificate, CertificateStatus } from '@modul@core/digital-certifica@core/entiti@core/digital-certificate';
import { DigitalCertificateRepository } from '@modul@core/digital-certifica@core/repositori@core/digital-certificate-repository';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

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
      @core// Busca o certificado que queremos ativar
        const certificate = await this.digitalCertificateRepository.findById(
            request.certificateId,
            request.businessId
        );

        if (!certificate) {
            return left(AppError.resourceNotFound('errors.CERTIFICATE_NOT_FOUND'))
        }

      @core// Verifica se o certificado pertence ao business
        if (request.businessId !== certificate.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

      @core// Verifica se o certificado pode ser ativado
      @core// if (certificate.isExpired()) {
      @core//     return left(AppError.invalidState('errors.CERTIFICATE_EXPIRED'));
      @core// }

      @core// Desativa todos os outros certificados do business
        await this.digitalCertificateRepository.deactivateAllFromBusiness(request.businessId);

      @core// Ativa o certificado selecionado
        certificate.markAsInstalled();

      @core// Salva as alterações
        await this.digitalCertificateRepository.save(certificate);

        return right({
            certificate,
            message: this.i18nService.translate('messages.CERTIFICATE_ACTIVATED', language)
        });
    }
}