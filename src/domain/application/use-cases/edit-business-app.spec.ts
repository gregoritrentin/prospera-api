import { EditBusinessAppUseCase } from "@/domain/application/use-cases/edit-business-app";
import { InMemoryBusinessAppRepository } from "test/repositories/in-memory-business-app-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AppError } from "@/core/errors/app-errors";
import { tr } from "@faker-js/faker/.";
import { BusinessApp } from "../entities/business-app";

let inMemoryBusinessAppsRepository: InMemoryBusinessAppRepository;
let sut: EditBusinessAppUseCase;

describe("Edit BusinessApp", () => {
  beforeEach(() => {
    inMemoryBusinessAppsRepository = new InMemoryBusinessAppRepository();
    sut = new EditBusinessAppUseCase(inMemoryBusinessAppsRepository);
  });

  it("should be able to edit a business app", async () => {
    // Criação COMPLETA do BusinessApp
    const newBusinessApp = BusinessApp.create({
      appId: new UniqueEntityID("123e4567-e89b-12d3-a456-426614174000"),
      businessId: new UniqueEntityID("business-123"),
      price: 100,
      quantity: 50,
      status: "ACTIVE", // Campo obrigatório
      // Note que não precisa passar createdAt, ele será gerado automaticamente
    });

    // Criando no repositório in-memory
    await inMemoryBusinessAppsRepository.create(newBusinessApp);

    // Primeira edição (apenas preço)
    const resultFirstEdit = await sut.execute({
      businessAppId: "123e4567-e89b-12d3-a456-426614174000",
      price: 200,
    });

    // Verificações da primeira edição
    expect(resultFirstEdit.isRight()).toBe(true);
    expect(inMemoryBusinessAppsRepository.items[0].price).toBe(200);
  });
});

it("should not be able to edit a non-existing business app", async () => {
  const result = await sut.execute({
    businessAppId: "non-existing-id",
    price: 2,
    quantity: 32,
    status: "ACTIVE",
  });
  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(
    AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
  );
});
