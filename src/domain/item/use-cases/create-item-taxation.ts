import { ItemTaxation } from '@/domain/item/entities/item-taxation'
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

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
