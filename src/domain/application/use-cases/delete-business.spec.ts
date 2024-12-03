import { AppError } from "@/core/errors/app-errors";
import { DeleteBusinessUseCase } from "@/domain/application/use-cases/delete-business";
import { InMemoryBusinessRepository } from "test/repositories/in-memory-business-repository";

let inMemoryBusinessRepository: InMemoryBusinessRepository;
let sut: DeleteBusinessUseCase;

describe("Delete Business", () => {
  beforeEach(() => {
    inMemoryBusinessRepository = new InMemoryBusinessRepository();
    sut = new DeleteBusinessUseCase(inMemoryBusinessRepository);
  });

  it("should be able to delete a business", async () => {
    // Criar um business com a estrutura correta
    const newBusiness = {
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryBusinessRepository.create(newBusiness);

    await sut.execute({
      businessId: newBusiness.businessId, // Use businessId from the created business
    });

    expect(inMemoryBusinessRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a non-existing business ", async () => {
    const result = await sut.execute({
      businessId: "non-existing-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a business that is already deleted", async () => {
    const newBusiness = {
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryBusinessRepository.create(newBusiness);
    await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    });
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a business with an invalid businessId", async () => {
    const result = await sut.execute({
      businessId: "",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call the delete method of the repository with the correct business", async () => {
    const newBusiness = {
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryBusinessRepository.create(newBusiness);
    const deleteSpy = vi.spyOn(inMemoryBusinessRepository, "delete");
    await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    });
    expect(deleteSpy).toHaveBeenCalledWith(newBusiness);
  });
});
