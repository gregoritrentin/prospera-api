import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { BusinessOwnerRepository } from "@/domain/application/repositories/business-owner-repository";
import { Injectable } from "@nestjs/common";

interface DeleteBusinessOwnerUseCaseRequest {
  businessOwnerId: string;
}

type DeleteBusinessOwnerUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteBusinessOwnerUseCase {
  constructor(private businessOwnerRepository: BusinessOwnerRepository) {}

  async execute({
    businessOwnerId,
  }: DeleteBusinessOwnerUseCaseRequest): Promise<DeleteBusinessOwnerUseCaseResponse> {
    const businessOwner =
      await this.businessOwnerRepository.findById(businessOwnerId);

    if (!businessOwner) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    await this.businessOwnerRepository.delete(businessOwner);

    return right(null);
  }
}
