import { Item } from '@/modules/it/domain/entiti/item'
import { ItemRepository } from '@/modules/it/domain/repositori/item-repository'
import { Injectable } from '@nestjs/common'

import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
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

      @core// ncm,
      @core// groupId,
      @core// taxationId

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

      @core// item.groupId = groupId
      @core// item.taxationId = taxationId
      @core// item.ncm = ncm

        await this.itemRepository.save(item)

        return right({
            item,
        })
    }
}