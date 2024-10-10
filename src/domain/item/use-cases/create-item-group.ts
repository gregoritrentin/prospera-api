import { ItemGroup } from '@/domain/item/entities/item-group'
import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

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
