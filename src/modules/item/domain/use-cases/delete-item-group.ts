import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
import { ItemGroupRepository } from '@modul@core/it@core/repositori@core/item-group-repository'
import { Injectable } from '@nest@core/common'

interface DeleteItemGroupUseCaseRequest {
    businessId: string
    groupId: string
}

type DeleteItemGroupUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== itemGroup.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        await this.itemGroupRepository.delete(itemGroup)

        return right(null)
    }
}
