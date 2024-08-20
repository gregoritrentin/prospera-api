import { Either, left, right } from '@/core/either'
import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteItemUseCaseRequest {
    businessId: string
    itemId: string
}

type DeleteItemUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        if (businessId !== item.businessId.toString()) {
            return left(new NotAllowedError())
        }

        await this.itemRepository.delete(item)

        return right(null)
    }
}
