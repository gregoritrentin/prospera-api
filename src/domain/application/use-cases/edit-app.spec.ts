import { InMemoryAppsRepository } from "test/repositories/in-memory-app-repository";
import { EditAppUseCase } from "@/domain/application/use-cases/edit-app";
import { AppError } from "@/core/errors/app-errors";
import { makeApp } from "test/factories/make-app";

describe("EditAppUseCase", () => {
  let inMemoryAppsRepository: InMemoryAppsRepository;
  let sut: EditAppUseCase;

  beforeEach(() => {
    inMemoryAppsRepository = new InMemoryAppsRepository();
    sut = new EditAppUseCase(inMemoryAppsRepository);
  });

  // Casos de teste existentes...

  it("should not be able to edit with invalid price", async () => {
    const newApp = makeApp();
    await inMemoryAppsRepository.create(newApp);

    const result = await sut.execute({
      appId: newApp.id.toString(),
      name: "Updated App",
      description: "Updated description",
      price: -10, // Preço negativo
      quantity: 50,
      type: "utility",
      status: "active",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(AppError.invalidData("errors.INVALID_PRICE"));
  });

  it("should not be able to edit with negative quantity", async () => {
    const newApp = makeApp();
    await inMemoryAppsRepository.create(newApp);

    const result = await sut.execute({
      appId: newApp.id.toString(),
      name: "Updated App",
      description: "Updated description",
      price: 99.99,
      quantity: -5, // Quantidade negativa
      type: "utility",
      status: "active",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidData("errors.INVALID_QUANTITY")
    );
  });

  it("should not be able to edit with empty name", async () => {
    const newApp = makeApp();
    await inMemoryAppsRepository.create(newApp);

    const result = await sut.execute({
      appId: newApp.id.toString(),
      name: "", // Nome vazio
      description: "Updated description",
      price: 99.99,
      quantity: 50,
      type: "utility",
      status: "active",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(AppError.invalidData("errors.EMPTY_NAME"));
  });

  it("should not be able to edit with invalid status", async () => {
    const newApp = makeApp();
    await inMemoryAppsRepository.create(newApp);

    const result = await sut.execute({
      appId: newApp.id.toString(),
      name: "Updated App",
      description: "Updated description",
      price: 99.99,
      quantity: 50,
      type: "utility",
      status: "invalid-status", // Status inválido
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(AppError.invalidData("errors.INVALID_STATUS"));
  });

  it("should be able to edit an app", async () => {
    const newApp = makeApp();
    await inMemoryAppsRepository.create(newApp);

    const result = await sut.execute({
      appId: newApp.id.toString(),
      name: "Updated App",
      description: "Updated description",
      price: 99.99,
      quantity: 50,
      type: "utility",
      status: "active",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      app: expect.objectContaining({
        name: "Updated App",
        description: "Updated description",
        price: 99.99,
        quantity: 50,
        type: "utility",
        status: "active",
      }),
    });
  });

  it("should not be able to edit a non-existent app", async () => {
    const result = await sut.execute({
      appId: "non-existent-id",
      name: "Updated App",
      description: "Updated description",
      price: 99.99,
      quantity: 50,
      type: "utility",
      status: "active",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });
});
