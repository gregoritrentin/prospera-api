import { DigitalCertificateRepository } from '@modul@core/digital-certifica@core/repositori@core/digital-certificate-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { DigitalCertificate } from '@core/entiti@core/digital-certificate'

interface FetchDigitalCertificateUseCaseRequest {
    page: number
    businessId: string
}

type FetchDigitalCertificateUseCaseResponse = Either<
    null,
    {
        certificates: DigitalCertificate[]
    }
>

@Injectable()
export class FetchDigitalCertificatesUseCase {
    constructor(private digitalCertificateRepository: DigitalCertificateRepository) { }

    async execute({
        page,
        businessId
    }: FetchDigitalCertificateUseCaseRequest): Promise<FetchDigitalCertificateUseCaseResponse> {
        const certificates = await this.digitalCertificateRepository.findMany(
            { page },
            businessId
        )

        return right({
            certificates,
        })
    }
}