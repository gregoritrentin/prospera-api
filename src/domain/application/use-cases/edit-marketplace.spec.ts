import { InMemorymarketplaceRepository } from "test/repositories/in-memory-marketplace-repository";
import { EditMarketplaceUseCase } from "@/domain/application/use-cases/edit-marketplace";
import { AppError } from "@/core/errors/app-errors";
import { Marketplace } from "../entities/marketplace";

describe("EditMarketplaceUseCase", () => {
  let useCase: EditMarketplaceUseCase;
  let marketplaceRepository: InMemorymarketplaceRepository;

  beforeEach(() => {
    marketplaceRepository = new InMemorymarketplaceRepository();
    useCase = new EditMarketplaceUseCase(marketplaceRepository);
  });

  // Casos de teste existentes (os anteriores)
  it("should be able to edit a marketplace", async () => {
    const newMarketplace = Marketplace.create({
      name: "Gregori Trentin",
      document: "1234.5.67-8901",
      status: "PENDING",
    });
    newMarketplace.marketplaceId = "marketplace-1";
    marketplaceRepository.items.push(newMarketplace);

    const result = await useCase.execute({
      marketplaceId: "marketplace-1",
      name: "Updated Marketplace",
      status: "INACTIVE",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.marketplace.name).toBe("Updated Marketplace");
      expect(result.value.marketplace.status).toBe("INACTIVE");
    }
  });

  // Cenário de marketplace não encontrado
  it("should return an error when marketplace is not found", async () => {
    const result = await useCase.execute({
      marketplaceId: "non-existent-id",
      name: "Updated Marketplace",
      status: "INACTIVE",
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("NOT_FOUND");
    }
  });

  // NOVOS CENÁRIOS DE TESTE

  // Validação de nome
  it("should not allow empty name", async () => {
    const newMarketplace = Marketplace.create({
      name: "Gregori Trentin",
      document: "1234.5.67-8901",
      status: "PENDING",
    });
    newMarketplace.marketplaceId = "marketplace-1";
    marketplaceRepository.items.push(newMarketplace);

    const result = await useCase.execute({
      marketplaceId: "marketplace-1",
      name: "", // Nome vazio
      status: "ACTIVE",
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("BAD_REQUEST");
    }
  });

  // Validação de status
  it("should not allow invalid status", async () => {
    const newMarketplace = Marketplace.create({
      name: "Gregori Trentin",
      document: "1234.5.67-8901",
      status: "PENDING",
    });
    newMarketplace.marketplaceId = "marketplace-1";
    marketplaceRepository.items.push(newMarketplace);

    const result = await useCase.execute({
      marketplaceId: "marketplace-1",
      name: "Valid Name",
      status: "INVALID_STATUS", // Status inválido
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("INVALID_DATA");
    }
  });
});
