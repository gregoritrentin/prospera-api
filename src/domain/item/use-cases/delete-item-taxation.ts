import { Either, left, right } from '@/core/either'
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteItemTaxationUseCaseRequest {
    businessId: string
    taxationId: string
}

type DeleteItemTaxationUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteItemTaxationUseCase {
    constructor(private itemTaxationRepository: ItemTaxationRepository) { }

    async execute({
        businessId,
        taxationId,
    }: DeleteItemTaxationUseCaseRequest): Promise<DeleteItemTaxationUseCaseResponse> {
        const itemTaxation = await this.itemTaxationRepository.findById(taxationId, businessId)

        if (!itemTaxation) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== itemTaxation.businessId.toString()) {
            return left(new NotAllowedError())
        }

        await this.itemTaxationRepository.delete(itemTaxation)

        return right(null)
    }
}
