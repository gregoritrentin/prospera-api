import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ItemTaxation } from '@/domain/item/entities/item-taxation'

interface FetchItemTaxationUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchItemTaxationUseCaseResponse = Either<
    null,
    {
        itemTaxation: ItemTaxation[]
    }
>

@Injectable()
export class FetchItemTaxationUseCase {
    constructor(private itemTaxationRepository: ItemTaxationRepository) { }

    async execute({ page, businessId }: FetchItemTaxationUseCaseRequest): Promise<FetchItemTaxationUseCaseResponse> {

        const itemTaxation = await this.itemTaxationRepository.findMany({ page }, businessId)

        return right({
            itemTaxation,
        })
    }
}