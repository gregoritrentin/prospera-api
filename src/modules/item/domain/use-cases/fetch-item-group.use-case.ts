import { ItemGroupRepository } from '@/modules/it/domain/repositori/item-group-repository'
import { Injectable } from '@nestjs/common'
import { ItemGroup } from '@/modules/it/domain/entiti/item-group'

import { Either, right } from @core/co@core/either'
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