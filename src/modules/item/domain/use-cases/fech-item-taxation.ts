import { ItemTaxationRepository } from '@modul@core/it@core/repositori@core/item-taxation-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { ItemTaxation } from '@modul@core/it@core/entiti@core/item-taxation'

interface FetchItemTaxationUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchItemTaxationUseCaseResponse = Either<
    null,
    {
        itemTaxation: ItemTaxation[]
    }
>

@Injectable()
export class FetchItemTaxationUseCase {
    constructor(private itemTaxationRepository: ItemTaxationRepository) { }

    async execute({ page, businessId }: FetchItemTaxationUseCaseRequest): Promise<FetchItemTaxationUseCaseResponse> {

        const itemTaxation = await this.itemTaxationRepository.findMany({ page }, businessId)

        return right({
            itemTaxation,
        })
    }
}