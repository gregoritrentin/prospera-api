import { EditAppUseCase } from "@/domain/application/use-cases/edit-app";
import { InMemoryAppsRepository } from "test/repositories/in-memory-app-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAppsRepository: InMemoryAppsRepository;
let sut: EditAppUseCase;

describe("Edit App", () => {
  beforeEach(() => {
    inMemoryAppsRepository = new InMemoryAppsRepository();
    sut = new EditAppUseCase(inMemoryAppsRepository);
  });

  it("should be able to edit a app", async () => {
    const newApp = {
      id: new UniqueEntityID("550e8400-e29b-41d4-a716"),
      name: "Nota Fiscal Eletronica",
      description: "Gregori Trentin app",
      price: 100,
      quantity: 1,
      type: "APP",
      status: "ACTIVE",
      createdAt: new Date(),
    };
    await inMemoryAppsRepository.create(newApp);
    await sut.execute({ appId: "550e8400-e29b-41d4-a716" });

    expect(inMemoryAppsRepository.items).toHaveLength(0);
  });
});
