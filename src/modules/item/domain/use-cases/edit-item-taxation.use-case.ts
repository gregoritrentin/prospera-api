import { ItemTaxation } from '@/modules/it/domain/entiti/item-taxation'
import { ItemTaxationRepository } from '@/modules/it/domain/repositori/item-taxation-repository'
import { Injectable } from '@nestjs/common'

import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
interface EditItemTaxationUseCaseRequest {
    businessId: string
    taxationId: string
    taxation: string
    status: string
}

type EditGroupUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== itemTaxation.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        itemTaxation.taxation = taxation
        itemTaxation.status = status

        await this.itemTaxationRepository.save(itemTaxation)

        return right({
            itemTaxation,
        })
    }
}