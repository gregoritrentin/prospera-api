import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Marketplace } from "../entities/marketplace";
import { MarketplaceRepository } from "../repositories/marketplace-repository";
import { AppError } from "@/core/errors/app-errors";

interface EditMarketplaceUseCaseRequest {
  marketplaceId: string;
  name: string;
  status: string;
}

type EditMarketplaceUseCaseResponse = Either<
  AppError,
  {
    marketplace: Marketplace;
  }
>;

@Injectable()
export class EditMarketplaceUseCase {
  constructor(private marketplaceRepository: MarketplaceRepository) {}

  async execute({
    marketplaceId,
    name,
    status,
  }: EditMarketplaceUseCaseRequest): Promise<EditMarketplaceUseCaseResponse> {
    // Validar nome
    if (!name || name.trim() === "") {
      return left(AppError.badRequest("Nome não pode ser vazio"));
    }

    // Validar status
    const validStatuses = ["ACTIVE", "INACTIVE", "PENDING"];
    if (!validStatuses.includes(status)) {
      return left(AppError.invalidData("Status inválido"));
    }

    const marketplace =
      await this.marketplaceRepository.findById(marketplaceId);

    if (!marketplace) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    marketplace.name = name;
    marketplace.status = status;

    await this.marketplaceRepository.save(marketplace);

    return right({
      marketplace,
    });
  }
}
