import { Either, left, right } from '@/core/either'
import { BusinessOwnerRepository } from '@/domain/core/repositories/business-owner-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteBusinessOwnerUseCaseRequest {
    businessOwnerId: string
}

type DeleteBusinessOwnerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteBusinessOwnerUseCase {
    constructor(private businessOwnerRepository: BusinessOwnerRepository) { }

    async execute({
        businessOwnerId,
    }: DeleteBusinessOwnerUseCaseRequest): Promise<DeleteBusinessOwnerUseCaseResponse> {
        const businessOwner = await this.businessOwnerRepository.findById(businessOwnerId)

        if (!businessOwner) {
            return left(new ResourceNotFoundError())
        }

        await this.businessOwnerRepository.delete(businessOwner)

        return right(null)
    }
}
