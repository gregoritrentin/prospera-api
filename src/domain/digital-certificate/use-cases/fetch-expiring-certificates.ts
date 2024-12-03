import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { DigitalCertificate } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { I18nService, Language } from '@/i18n/i18n.service';

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
            '*', // Indica que queremos buscar de todos os businesses
            request.daysToExpire
        );

        return right({
            certificates,
            message: this.i18nService.translate('messages.EXPIRING_CERTIFICATES_RETRIEVED', language)
        });
    }
}