import { Item } from '@/domain/item/entities/item'
import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateItemUseCaseRequest {
    businessId: string
    description: string
    idAux: string
    itemType: string
    unit: string
    price: number
    ncm?: string | null
    taxationId?: string | null
    groupId?: string | null
    status: string

}

type CreateItemUseCaseResponse = Either<
    null,
    {
        item: Item
    }
>

@Injectable()
export class CreateItemUseCase {
    constructor(private itemRepository: ItemRepository) { }

    async execute({
        businessId,
        description,
        idAux,
        itemType,
        unit,
        price,
        ncm,
        taxationId,
        groupId,
        status

    }: CreateItemUseCaseRequest): Promise<CreateItemUseCaseResponse> {
        const item = Item.create({
            businessId: new UniqueEntityID(businessId),
            description,
            idAux,
            itemType,
            unit,
            price,
            ncm,
            taxationId,
            groupId,
            status,
        })

        await this.itemRepository.create(item)

        return right({
            item,
        })
    }
}
