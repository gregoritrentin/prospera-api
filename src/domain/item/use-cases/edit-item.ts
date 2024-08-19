import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Item } from '@/domain/item/entities/item'
import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { Injectable } from '@nestjs/common'

interface EditItemUseCaseRequest {
    businessId: string
    itemId: string
    description: string
    idAux: string
    unit: string
    price: number
    itemType: string
    ncm?: string | null
    status: string
    groupId?: string | null
    taxationId?: string | null

}

type EditPersonUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        item: Item
    }
>

@Injectable()
export class EditItemUseCase {
    constructor(
        private itemRepository: ItemRepository,
    ) { }

    async execute({
        businessId,
        itemId,
        idAux,
        description,
        itemType,
        price,
        status,
        unit,

        // ncm,
        // groupId,
        // taxationId

    }: EditItemUseCaseRequest): Promise<EditPersonUseCaseResponse> {
        const item = await this.itemRepository.findById(itemId, businessId)

        if (!item) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== item.businessId.toString()) {
            return left(new NotAllowedError())
        }

        item.description = description
        item.unit = unit
        item.price = price
        item.status = status
        item.itemType = itemType

        item.idAux = idAux
        // item.groupId = groupId
        // item.taxationId = taxationId
        // item.ncm = ncm

        await this.itemRepository.save(item)

        return right({
            item,
        })
    }
}
