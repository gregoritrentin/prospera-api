import { DeleteBusinessOwnerUseCase } from "@/domain/application/use-cases/delete-business-owner";
import { InMemoryBusinessOwnerRepository } from "test/repositories/in-memory-business-owner-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { BusinessOwner } from "../entities/business-owner";

let inMemoryBusinessOwnersRepository: InMemoryBusinessOwnerRepository;
let sut: DeleteBusinessOwnerUseCase;

describe("Delete BusinessOwner", () => {
  beforeEach(() => {
    inMemoryBusinessOwnersRepository = new InMemoryBusinessOwnerRepository();
    sut = new DeleteBusinessOwnerUseCase(inMemoryBusinessOwnersRepository);
  });

  it("should be able to delete a business owner", async () => {
    const newBusinessOwner = {
      businessId: new UniqueEntityID("123e4567-e89b-12d3-a456-426614174020"),
    };
    await inMemoryBusinessOwnersRepository.create(newBusinessOwner);

    await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
    });
    expect(inMemoryBusinessOwnersRepository.items).toHaveLength(0);
  });
});
