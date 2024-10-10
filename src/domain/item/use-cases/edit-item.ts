import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
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
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== item.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
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
