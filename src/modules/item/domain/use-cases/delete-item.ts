import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
import { ItemRepository } from '@modul@core/it@core/repositori@core/item-repository'
import { Injectable } from '@nest@core/common'

interface DeleteItemUseCaseRequest {
    businessId: string
    itemId: string
}

type DeleteItemUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteItemUseCase {
    constructor(private itemRepository: ItemRepository) { }

    async execute({
        businessId,
        itemId,
    }: DeleteItemUseCaseRequest): Promise<DeleteItemUseCaseResponse> {
        const item = await this.itemRepository.findById(itemId, businessId)

        if (!item) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== item.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        await this.itemRepository.delete(item)

        return right(null)
    }
}
