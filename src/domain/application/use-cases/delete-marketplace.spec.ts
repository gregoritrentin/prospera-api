// delete-marketplace.spec.ts
import { DeleteMarketplaceUseCase } from "@/domain/application/use-cases/delete-marketplace";
import { InMemorymarketplaceRepository } from "test/repositories/in-memory-marketplace-repository";
import { Marketplace } from "@/domain/application/entities/marketplace";
import { AppError } from "@/core/errors/app-errors";

let inMemoryMarketplaceRepository: InMemorymarketplaceRepository;
let sut: DeleteMarketplaceUseCase;

describe("Delete Marketplace", () => {
  beforeEach(() => {
    inMemoryMarketplaceRepository = new InMemorymarketplaceRepository();
    sut = new DeleteMarketplaceUseCase(inMemoryMarketplaceRepository);
  });

  it("should be able to delete a marketplace", async () => {
    const newMarketplace = {
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    } as Marketplace;

    await inMemoryMarketplaceRepository.create(newMarketplace);

    const result = await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryMarketplaceRepository.items).toHaveLength(0);

    // Verificação adicional para garantir que o marketplace foi completamente removido
    const deletedMarketplace = await inMemoryMarketplaceRepository.findById(
      "123e4567-e89b-12d3-a456-426614174020"
    );
    expect(deletedMarketplace).toBeNull();
  });

  it("should not be able to delete a non-existing marketplace", async () => {
    const result = await sut.execute({
      marketplaceId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a marketplace with empty id", async () => {
    const result = await sut.execute({
      marketplaceId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_MARKETPLACE_ID")
    );
  });

  it("should not be able to delete an already deleted marketplace", async () => {
    const newMarketplace = {
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    } as Marketplace;

    await inMemoryMarketplaceRepository.create(newMarketplace);

    // Primeira deleção
    await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    });

    // Tentativa de segunda deleção
    const result = await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call repository delete method with correct marketplace", async () => {
    const newMarketplace = {
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    } as Marketplace;

    await inMemoryMarketplaceRepository.create(newMarketplace);

    const deleteSpy = vi.spyOn(inMemoryMarketplaceRepository, "delete");

    await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(deleteSpy).toHaveBeenCalledWith(newMarketplace);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
