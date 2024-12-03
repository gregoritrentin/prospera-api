import { DeleteItemUseCase } from "./delete-item";
import { InMemoryItemsRepository } from "test/repositories/in-memory-item-repository";
import { AppError } from "@/core/errors/app-errors";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Item } from "../entities/item";

let inMemoryItemsRepository: InMemoryItemsRepository;
let sut: DeleteItemUseCase;

describe("Delete Item", () => {
  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    sut = new DeleteItemUseCase(inMemoryItemsRepository);
  });

  it("should be able to delete an item", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";
    const itemId = "123e4567-e89b-12d3-a456-426614174020";

    const newItem = Item.create({
      businessId: new UniqueEntityID(businessId),
      idAux: itemId,
      description: "Test Item",
      itemType: "product",
      price: 10.0,
      unit: "UN",
      status: "active",
    });

    await inMemoryItemsRepository.create(newItem);

    const result = await sut.execute({
      businessId,
      itemId: newItem.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryItemsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a non-existing item", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      itemId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an item with empty businessId", async () => {
    const result = await sut.execute({
      businessId: "",
      itemId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_TERM_ID")
    );
  });

  it("should not be able to delete an item with empty itemId", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      itemId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_TERM_ID")
    );
  });

  it("should not be able to delete an item from a different business", async () => {
    const correctBusinessId = "123e4567-e89b-12d3-a456-426614174000";
    const wrongBusinessId = "123e4567-e89b-12d3-a456-426614174999";

    const newItem = Item.create({
      businessId: new UniqueEntityID(correctBusinessId),
      idAux: "some-id",
      description: "Test Item",
      itemType: "product",
      price: 10.0,
      unit: "UN",
      status: "active",
    });

    await inMemoryItemsRepository.create(newItem);

    const result = await sut.execute({
      businessId: wrongBusinessId,
      itemId: newItem.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an already deleted item", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";

    const newItem = Item.create({
      businessId: new UniqueEntityID(businessId),
      idAux: "some-id",
      description: "Test Item",
      itemType: "product",
      price: 10.0,
      unit: "UN",
      status: "active",
    });

    await inMemoryItemsRepository.create(newItem);

    // First deletion
    await sut.execute({
      businessId,
      itemId: newItem.id.toString(),
    });

    // Try to delete again
    const result = await sut.execute({
      businessId,
      itemId: newItem.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });
});
