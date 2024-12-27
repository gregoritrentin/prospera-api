import { ItemGroup } from '@modul@core/it@core/entiti@core/item-group'
import { ItemGroupRepository } from '@modul@core/it@core/repositori@core/item-group-repository'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'

interface CreateItemGroupUseCaseRequest {
    businessId: string
    group: string
    status: string
}

type CreateItemGroupUseCaseResponse = Either<
    null,
    {
        itemGroup: ItemGroup
    }
>

@Injectable()
export class CreateItemGroupUseCase {
    constructor(private itemGroupRepository: ItemGroupRepository) { }

    async execute({
        businessId,
        group,
        status

    }: CreateItemGroupUseCaseRequest): Promise<CreateItemGroupUseCaseResponse> {
        const itemGroup = ItemGroup.create({
            businessId: new UniqueEntityID(businessId),
            group,
            status,
        })

        await this.itemGroupRepository.create(itemGroup)

        return right({
            itemGroup,
        })
    }
}
