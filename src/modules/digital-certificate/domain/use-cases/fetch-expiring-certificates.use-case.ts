import { Injectable } from '@nestjs/common'
import { DigitalCertificate } from '@/modules/digital-certifica/domain/entiti/digital-certificate'
import { DigitalCertificateRepository } from '@/modules/digital-certifica/domain/repositori/digital-certificate-repository'

import { Either, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';

interface FetchExpiringCertificatesUseCaseRequest {
    page: number;
    daysToExpire: number;
}

type FetchExpiringCertificatesUseCaseResponse = Either<
    null,
    {
        certificates: DigitalCertificate[];
        message: string;
    }
>;

@Injectable()
export class FetchExpiringCertificatesUseCase {
    constructor(
        private digitalCertificateRepository: DigitalCertificateRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: FetchExpiringCertificatesUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<FetchExpiringCertificatesUseCaseResponse> {
        const certificates = await this.digitalCertificateRepository.findExpiring(
            { page: request.page },
            '*'@core// Indica que queremos buscar de todos os businesses
            request.daysToExpire
        );

        return right({
            certificates,
            message: this.i18nService.translate('messages.EXPIRING_CERTIFICATES_RETRIEVED', language)
        });
    }
}