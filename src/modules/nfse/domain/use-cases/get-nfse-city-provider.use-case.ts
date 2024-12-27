import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NfseCityConfiguration } from '../entities/nfse-city-configuration'
import { NfseCityConfigurationRepository } from '../repositories/nfse-city-configuration-repository'
import { I18nService, Language } from '@/i18n/i18n.service'
import { AppError } from '@core/error/app-errors'

interface GetNfseCityProviderRequest {
    cityCode: string
}

type GetNfseCityProviderResponse = Either<
    AppError,
    {
        provider: NfseCityConfiguration
        message: string
    }
>

@Injectable()
export class GetNfseCityProviderUseCase {
    constructor(
        private nfseCityConfigurationRepository: NfseCityConfigurationRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetNfseCityProviderRequest,
        language: string | Language = 'en-US'
    ): Promise<GetNfseCityProviderResponse> {
        try {
            const provider = await this.nfseCityConfigurationRepository.findByCityCode(
                request.cityCode
            )

            if (!provider) {
                return left(
                    AppError.resourceNotFound(
                        this.i18nService.translate('errors.NFSE_PROVIDER_NOT_FOUND', language, {
                            cityCode: request.cityCode
                        })
                    )
                )
            }

            return right({
                provider,
                message: this.i18nService.translate('messages.NFSE_PROVIDER_FOUND', language)
            })
        } catch (error) {
            return left(
                AppError.internalServerError(
                    this.i18nService.translate('errors.FAILED_TO_GET_NFSE_PROVIDER', language)
                )
            )
        }
    }
}