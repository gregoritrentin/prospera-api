import { PixRepository } from '@/domain/transaction/repositories/pix-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PixDetails } from '@/domain/transaction/entities/value-objects/pix-details'

interface FetchPixsUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchPixsUseCaseResponse = Either<
    null,
    {
        pixs: PixDetails[]
    }
>

@Injectable()
export class FetchPixUseCase {
    constructor(private pixRepository: PixRepository) { }

    async execute({ page, businessId }: FetchPixsUseCaseRequest): Promise<FetchPixsUseCaseResponse> {
        const pixs = await this.pixRepository.findManyDetails({ page }, businessId)

        return right({
            pixs,
        })
    }
}