import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
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
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== itemGroup.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        itemGroup.group = group
        itemGroup.status = status

        await this.itemGroupRepository.save(itemGroup)

        return right({
            itemGroup,
        })
    }
}
