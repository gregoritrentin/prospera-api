import { Injectable } from '@nestjs/common'
import { DigitalCertificate, CertificateStatus } from '@/modules/digital-certifica/domain/entiti/digital-certificate'
import { DigitalCertificateRepository } from '@/modules/digital-certifica/domain/repositori/digital-certificate-repository'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

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