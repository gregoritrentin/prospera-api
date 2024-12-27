import { ItemGroupRepository } from '@modul@core/it@core/repositori@core/item-group-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { ItemGroup } from '@modul@core/it@core/entiti@core/item-group'

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