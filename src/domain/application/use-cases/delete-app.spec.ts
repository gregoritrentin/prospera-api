import { DeleteAppUseCase } from "@/domain/application/use-cases/delete-app";
import { InMemoryAppsRepository } from "test/repositories/in-memory-app-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AppError } from "@/core/errors/app-errors";

let inMemoryAppsRepository: InMemoryAppsRepository;
let sut: DeleteAppUseCase;

describe("Delete App", () => {
  beforeEach(() => {
    inMemoryAppsRepository = new InMemoryAppsRepository();
    sut = new DeleteAppUseCase(inMemoryAppsRepository);
  });

  it("should be able to delete a app", async () => {
    const newApp = {
      id: new UniqueEntityID("550e8400-e29b-41d4-a716"),
      name: "Nota Fiscal Eletronica",
      description: "Gregori Trentin app",
      price: 100,
      quantity: 1,
      type: "APP",
      status: "ACTIVE",
    };
    await inMemoryAppsRepository.create(newApp);
    const deleteSpy = vi.spyOn(inMemoryAppsRepository, "delete");
    const result = await sut.execute({
      appId: newApp.id.toString(),
    });
    const deletedApp = await inMemoryAppsRepository.findById(
      newApp.id.toString()
    );
    expect(deletedApp).toBeNull();
    expect(result.isRight()).toBe(true);
    expect(inMemoryAppsRepository.items).toHaveLength(0);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it("should not be able to delete a non-existing app", async () => {
    const findByIdSpy = vi.spyOn(inMemoryAppsRepository, "findById");
    const result = await sut.execute({
      appId: "non-existing-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
    expect(inMemoryAppsRepository.items).toHaveLength(0);
    expect(findByIdSpy).toHaveBeenCalledWith("non-existing-id");
  });
});
