import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { MarketplaceRepository } from "@/domain/application/repositories/marketplace-repository";
import { Injectable } from "@nestjs/common";

interface DeleteMarketplaceUseCaseRequest {
  marketplaceId: string;
}

type DeleteMarketplaceUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteMarketplaceUseCase {
  constructor(private MarketplaceRepository: MarketplaceRepository) {}

  async execute({
    marketplaceId,
  }: DeleteMarketplaceUseCaseRequest): Promise<DeleteMarketplaceUseCaseResponse> {
    if (!marketplaceId) {
      return left(AppError.invalidParameter("errors.INVALID_MARKETPLACE_ID"));
    }

    const marketplace =
      await this.MarketplaceRepository.findById(marketplaceId);

    if (!marketplace) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    await this.MarketplaceRepository.delete(marketplace);

    const remainingMarketplace =
      await this.MarketplaceRepository.findById(marketplaceId);
    if (remainingMarketplace) {
      return left(AppError.unexpected("errors.DELETE_OPERATION_FAILED"));
    }

    return right(null);
  }
}
