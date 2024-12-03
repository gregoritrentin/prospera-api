import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DigitalCertificate } from '@/domain/digital-certificate/entities/digital-certificate';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';

interface GetDigitalCertificateUseCaseRequest {
    businessId: string;
    certificateId: string;
}

type GetDigitalCertificateUseCaseResponse = Either<
    AppError,
    {
        certificate: DigitalCertificate;
        message: string;
    }
>;

@Injectable()
export class GetDigitalCertificateUseCase {
    constructor(
        private digitalCertificateRepository: DigitalCertificateRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetDigitalCertificateUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetDigitalCertificateUseCaseResponse> {
        const certificate = await this.digitalCertificateRepository.findById(
            request.certificateId,
            request.businessId
        );

        if (!certificate) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== certificate.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            certificate,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}