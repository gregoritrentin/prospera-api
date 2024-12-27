import { ItemRepository } from '@modul@core/it@core/repositori@core/item-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { ItemDetails } from '@modul@core/it@core/entiti@core/value-objec@core/item-details'

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