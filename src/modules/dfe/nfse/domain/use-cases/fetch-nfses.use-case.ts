import { NfseRepository } from '@/modules/dfe/domain/nfse/repositories/nfse-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Nfse } from '../entities/nfse.entity'

// src/domain/nfse/use-cases/fetch-nfses.use-case.ts
interface FetchNfsesUseCaseRequest {
    page: number
    businessId: string
    startDate?: Date  // Adicionei opcionalmente para filtrar por período
    endDate?: Date
}

type FetchNfsesUseCaseResponse = Either<
    null,
    {
        nfses: Nfse[]
    }
>

@Injectable()
export class FetchNfsesUseCase {
    constructor(private nfseRepository: NfseRepository) { }

    async execute({
        page,
        businessId,
        startDate,
        endDate
    }: FetchNfsesUseCaseRequest): Promise<FetchNfsesUseCaseResponse> {
        const nfses = await this.nfseRepository.findMany(
            { page },
            businessId,
            startDate,
            endDate
        )

        return right({
            nfses,
        })
    }
}