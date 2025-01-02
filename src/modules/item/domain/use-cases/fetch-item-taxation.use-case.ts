import { ItemTaxationRepository } from '@/modules/it/domain/repositori/item-taxation-repository'
import { Injectable } from '@nestjs/common'
import { ItemTaxation } from '@/modules/it/domain/entiti/item-taxation'

import { Either, right } from @core/co@core/either'
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