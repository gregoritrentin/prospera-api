import { Injectable } from '@nestjs/common'
import { DigitalCertificate } from '@/modules/digital-certifica/domain/entiti/digital-certificate'
import { DigitalCertificateRepository } from '@/modules/digital-certifica/domain/repositori/digital-certificate-repository'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';

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