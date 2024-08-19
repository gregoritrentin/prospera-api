import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ItemGroup } from '@/domain/item/entities/item-group'

interface FetchItemGroupUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchItemGroupUseCaseResponse = Either<
    null,
    {
        itemGroup: ItemGroup[]
    }
>

@Injectable()
export class FetchItemGroupUseCase {
    constructor(private itemGroupRepository: ItemGroupRepository) { }

    async execute({ page, businessId }: FetchItemGroupUseCaseRequest): Promise<FetchItemGroupUseCaseResponse> {

        const itemGroup = await this.itemGroupRepository.findMany({ page }, businessId)

        return right({
            itemGroup,
        })
    }
}