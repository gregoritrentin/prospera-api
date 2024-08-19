import { Either, left, right } from '@/core/either'
import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteItemGroupUseCaseRequest {
    businessId: string
    groupId: string
}

type DeleteItemGroupUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteItemGroupUseCase {
    constructor(private itemGroupRepository: ItemGroupRepository) { }

    async execute({
        businessId,
        groupId,
    }: DeleteItemGroupUseCaseRequest): Promise<DeleteItemGroupUseCaseResponse> {
        const itemGroup = await this.itemGroupRepository.findById(groupId, businessId)

        if (!itemGroup) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== itemGroup.businessId.toString()) {
            return left(new NotAllowedError())
        }

        await this.itemGroupRepository.delete(itemGroup)

        return right(null)
    }
}
