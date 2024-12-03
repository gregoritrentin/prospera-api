import { DeleteItemTaxationUseCase } from "./delete-item-taxation";
import { InMemoryItemTaxationRepository } from "test/repositories/in-memory-item-taxation-repository";
import { AppError } from "@/core/errors/app-errors";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ItemTaxation } from "../entities/item-taxation";

let inMemoryItemTaxationRepository: InMemoryItemTaxationRepository;
let sut: DeleteItemTaxationUseCase;

describe("Delete Item Taxation", () => {
  beforeEach(() => {
    inMemoryItemTaxationRepository = new InMemoryItemTaxationRepository();
    sut = new DeleteItemTaxationUseCase(inMemoryItemTaxationRepository);
  });

  it("should be able to delete an item taxation", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";

    const newItemTaxation = ItemTaxation.create({
      businessId: new UniqueEntityID(businessId),
      taxation: "ISS 5%",
      status: "active",
    });

    await inMemoryItemTaxationRepository.create(newItemTaxation);

    const result = await sut.execute({
      businessId,
      taxationId: newItemTaxation.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryItemTaxationRepository.itemTaxation).toHaveLength(0);
  });

  it("should not be able to delete a non-existing item taxation", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      taxationId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an item taxation with empty businessId", async () => {
    const result = await sut.execute({
      businessId: "",
      taxationId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete an item taxation with empty taxationId", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      taxationId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete an item taxation from a different business", async () => {
    const correctBusinessId = "123e4567-e89b-12d3-a456-426614174000";
    const wrongBusinessId = "123e4567-e89b-12d3-a456-426614174999";

    const newItemTaxation = ItemTaxation.create({
      businessId: new UniqueEntityID(correctBusinessId),
      taxation: "ISS 5%",
      status: "active",
    });

    await inMemoryItemTaxationRepository.create(newItemTaxation);

    const result = await sut.execute({
      businessId: wrongBusinessId,
      taxationId: newItemTaxation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.NOT_ALLOWED");
  });

  it("should not be able to delete an already deleted item taxation", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";

    const newItemTaxation = ItemTaxation.create({
      businessId: new UniqueEntityID(businessId),
      taxation: "ISS 5%",
      status: "active",
    });

    await inMemoryItemTaxationRepository.create(newItemTaxation);

    // First deletion
    await sut.execute({
      businessId,
      taxationId: newItemTaxation.id.toString(),
    });

    // Try to delete again
    const result = await sut.execute({
      businessId,
      taxationId: newItemTaxation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an item taxation with invalid businessId UUID format", async () => {
    const result = await sut.execute({
      businessId: "invalid-uuid-format",
      taxationId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an item taxation with invalid taxationId UUID format", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      taxationId: "invalid-uuid-format",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });
});
