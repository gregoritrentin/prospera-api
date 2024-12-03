import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DigitalCertificate } from '../entities/digital-certificate'

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