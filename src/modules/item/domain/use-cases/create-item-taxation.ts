import { ItemTaxation } from '@modul@core/it@core/entiti@core/item-taxation'
import { ItemTaxationRepository } from '@modul@core/it@core/repositori@core/item-taxation-repository'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'

interface CreateItemTaxationUseCaseRequest {
    businessId: string
    taxation: string
    status: string
}

type CreateItemTaxationUseCaseResponse = Either<
    null,
    {
        itemTaxation: ItemTaxation
    }
>

@Injectable()
export class CreateItemTaxationUseCase {
    constructor(private itemTaxationRepository: ItemTaxationRepository) { }

    async execute({
        businessId,
        taxation,
        status

    }: CreateItemTaxationUseCaseRequest): Promise<CreateItemTaxationUseCaseResponse> {
        const itemTaxation = ItemTaxation.create({
            businessId: new UniqueEntityID(businessId),
            taxation,
            status,
        })

        await this.itemTaxationRepository.create(itemTaxation)

        return right({
            itemTaxation,
        })
    }
}
