import { DigitalCertificateRepository } from '@/modules/digital-certifica/domain/repositori/digital-certificate-repository'
import { Injectable } from '@nestjs/common'
import { DigitalCertificate } from '@/core/domain/entities/digital-certificate.entity'

import { Either, right } from @core/co@core/either'
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