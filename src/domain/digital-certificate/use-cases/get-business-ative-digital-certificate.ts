import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DigitalCertificate, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';

interface GetBusinessActiveDigitalCertificateUseCaseRequest {
    businessId: string;
}

type GetBusinessActiveDigitalCertificateUseCaseResponse = Either<
    AppError,
    {
        certificate: DigitalCertificate;
        message: string;
    }
>;

@Injectable()
export class GetBusinessActiveDigitalCertificateUseCase {
    constructor(
        private digitalCertificateRepository: DigitalCertificateRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetBusinessActiveDigitalCertificateUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetBusinessActiveDigitalCertificateUseCaseResponse> {
        const certificate = await this.digitalCertificateRepository.findUniqueActive(
            request.businessId
        );

        if (!certificate) {
            return left(AppError.resourceNotFound('errors.NO_ACTIVE_CERTIFICATE'))
        }

        return right({
            certificate,
            message: this.i18nService.translate('messages.ACTIVE_CERTIFICATE_RETRIEVED', language)
        });
    }
}