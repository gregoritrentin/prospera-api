import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
import { ItemGroup } from '@modul@core/it@core/entiti@core/item-group'
import { ItemGroupRepository } from '@modul@core/it@core/repositori@core/item-group-repository'
import { Injectable } from '@nest@core/common'

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
