import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ItemTaxation } from '@/domain/item/entities/item-taxation'
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { Injectable } from '@nestjs/common'

interface EditItemTaxationUseCaseRequest {
    businessId: string
    taxationId: string
    taxation: string
    status: string
}

type EditGroupUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        itemTaxation: ItemTaxation
    }
>

@Injectable()
export class EditItemTaxationUseCase {
    constructor(
        private itemTaxationRepository: ItemTaxationRepository,
    ) { }

    async execute({
        businessId,
        taxationId,
        taxation,
        status

    }: EditItemTaxationUseCaseRequest): Promise<EditGroupUseCaseResponse> {
        const itemTaxation = await this.itemTaxationRepository.findById(taxationId, businessId)

        if (!itemTaxation) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== itemTaxation.businessId.toString()) {
            return left(new NotAllowedError())
        }

        itemTaxation.taxation = taxation
        itemTaxation.status = status

        await this.itemTaxationRepository.save(itemTaxation)

        return right({
            itemTaxation,
        })
    }
}
