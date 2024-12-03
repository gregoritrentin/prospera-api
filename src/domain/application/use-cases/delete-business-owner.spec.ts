import { DeleteBusinessOwnerUseCase } from "@/domain/application/use-cases/delete-business-owner";
import { InMemoryBusinessOwnerRepository } from "test/repositories/in-memory-business-owner-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AppError } from "@/core/errors/app-errors";

let inMemoryBusinessOwnersRepository: InMemoryBusinessOwnerRepository;
let sut: DeleteBusinessOwnerUseCase;

describe("Delete BusinessOwner", () => {
  beforeEach(() => {
    inMemoryBusinessOwnersRepository = new InMemoryBusinessOwnerRepository();
    sut = new DeleteBusinessOwnerUseCase(inMemoryBusinessOwnersRepository);
  });

  it("should be able to delete a business owner", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174020";
    const newBusinessOwner = {
      businessId: new UniqueEntityID(businessId),
    };

    await inMemoryBusinessOwnersRepository.create(newBusinessOwner);

    const deleteSpy = vi.spyOn(inMemoryBusinessOwnersRepository, "delete");
    const result = await sut.execute({
      businessOwnerId: businessId,
    });
    expect(deleteSpy).toHaveBeenCalledWith(newBusinessOwner);
    expect(inMemoryBusinessOwnersRepository.items).toHaveLength(0);
    expect(result.isRight()).toBe(true);
  });

  it("should not be able to delete with invalid UUID", async () => {
    const result = await sut.execute({
      businessOwnerId: "invalid-uuid",
    });

    expect(result.isLeft()).toBe(true);
  });

  it("should not be able to delete a non-existing business owner", async () => {
    const result = await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should emit BusinessOwnerDeletedEvent after deletion", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174020";
    const newBusinessOwner = {
      businessId: new UniqueEntityID(businessId),
    };

    await inMemoryBusinessOwnersRepository.create(newBusinessOwner);

    const deleteSpy = vi.spyOn(inMemoryBusinessOwnersRepository, "delete");

    await sut.execute({
      businessOwnerId: businessId,
    });
    expect(deleteSpy).toHaveBeenCalledWith(newBusinessOwner);
  });
});
