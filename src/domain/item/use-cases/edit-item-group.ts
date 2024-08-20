import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ItemGroup } from '@/domain/item/entities/item-group'
import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository'
import { Injectable } from '@nestjs/common'

interface EditItemGroupUseCaseRequest {
    businessId: string
    groupId: string
    group: string
    status: string
}

type EditGroupUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        itemGroup: ItemGroup
    }
>

@Injectable()
export class EditItemGroupUseCase {
    constructor(
        private itemGroupRepository: ItemGroupRepository,
    ) { }

    async execute({
        businessId,
        groupId,
        group,
        status

    }: EditItemGroupUseCaseRequest): Promise<EditGroupUseCaseResponse> {
        const itemGroup = await this.itemGroupRepository.findById(groupId, businessId)

        if (!itemGroup) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== itemGroup.businessId.toString()) {
            return left(new NotAllowedError())
        }

        itemGroup.group = group
        itemGroup.status = status

        await this.itemGroupRepository.save(itemGroup)

        return right({
            itemGroup,
        })
    }
}
