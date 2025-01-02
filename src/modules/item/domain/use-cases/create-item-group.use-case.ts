import { ItemGroup } from '@/modules/it/domain/entiti/item-group'
import { ItemGroupRepository } from '@/modules/it/domain/repositori/item-group-repository'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
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