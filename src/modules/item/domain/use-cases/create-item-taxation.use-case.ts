import { ItemTaxation } from '@/modules/it/domain/entiti/item-taxation'
import { ItemTaxationRepository } from '@/modules/it/domain/repositori/item-taxation-repository'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
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