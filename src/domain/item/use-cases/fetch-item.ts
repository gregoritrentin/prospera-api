import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ItemDetails } from '@/domain/item/entities/value-objects/item-details'

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