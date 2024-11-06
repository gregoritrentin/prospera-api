import { DeleteAppUseCase } from "@/domain/application/use-cases/delete-business-app";
import { InMemoryBusinessAppRepository } from "test/repositories/in-memory-business-app-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Business } from "../entities/business";
import { BusinessApp } from "../entities/business-app";

let inMemoryBusinessAppsRepository: InMemoryBusinessAppRepository;
let sut: DeleteAppUseCase;

describe("Delete BusinessApp", () => {
  beforeEach(() => {
    inMemoryBusinessAppsRepository = new InMemoryBusinessAppRepository();
    sut = new DeleteAppUseCase(inMemoryBusinessAppsRepository);
  });

  it("should be able to delete a business app", async () => {
    const newBusinessApp = {
      appId: new UniqueEntityID("550e8400-e29b-41d4-a716"),
      businessId: new UniqueEntityID("123e4567-e89b-12d3-a456-426614174000"),
      price: 100,
      quantity: 1,
      status: "ACTIVE",
    };
    await inMemoryBusinessAppsRepository.create(newBusinessApp);
    await sut.execute({ appId: "550e8400-e29b-41d4-a716" });
    expect(inMemoryBusinessAppsRepository.items).toHaveLength(0);
  });
});
