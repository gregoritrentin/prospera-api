import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { Injectable } from '@nestjs/common'

interface DeleteItemTaxationUseCaseRequest {
    businessId: string
    taxationId: string
}

type DeleteItemTaxationUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== itemTaxation.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        await this.itemTaxationRepository.delete(itemTaxation)

        return right(null)
    }
}
