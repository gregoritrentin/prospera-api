import { ItemRepository } from '@/modules/it/domain/repositori/item-repository'
import { Injectable } from '@nestjs/common'
import { ItemDetails } from '@/modules/it/domain/entities/item-details.entity'

import { Either, right } from @core/co@core/either'
interface FetchItemUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchItemUseCaseResponse = Either<
    null,
    {
        item: ItemDetails[]
    }
>

@Injectable()
export class FetchItemUseCase {
    constructor(private itemRepository: ItemRepository) { }

    async execute({ page, businessId }: FetchItemUseCaseRequest): Promise<FetchItemUseCaseResponse> {

        const item = await this.itemRepository.findManyDetails({ page }, businessId)

        return right({
            item,
        })
    }
}