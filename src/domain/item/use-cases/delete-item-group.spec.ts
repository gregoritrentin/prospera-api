import { DeleteItemGroupUseCase } from "./delete-item-group";
import { InMemoryItemGroupRepository } from "test/repositories/in-memory-item-group-repository";
import { AppError } from "@/core/errors/app-errors";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ItemGroup } from "../entities/item-group";

let inMemoryItemGroupRepository: InMemoryItemGroupRepository;
let sut: DeleteItemGroupUseCase;

describe("Delete Item Group", () => {
  beforeEach(() => {
    inMemoryItemGroupRepository = new InMemoryItemGroupRepository();
    sut = new DeleteItemGroupUseCase(inMemoryItemGroupRepository);
  });

  it("should be able to delete an item group", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";

    const newItemGroup = ItemGroup.create({
      businessId: new UniqueEntityID(businessId),
      group: "Vegetais",
      status: "ACTIVE",
    });

    await inMemoryItemGroupRepository.create(newItemGroup);

    const result = await sut.execute({
      businessId,
      groupId: newItemGroup.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryItemGroupRepository.itemGroups).toHaveLength(0);
  });

  it("should not be able to delete a non-existing item group", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      groupId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an item group with empty businessId", async () => {
    const result = await sut.execute({
      businessId: "",
      groupId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete an item group with empty groupId", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      groupId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete an item group from a different business", async () => {
    const correctBusinessId = "123e4567-e89b-12d3-a456-426614174000";
    const wrongBusinessId = "123e4567-e89b-12d3-a456-426614174999";

    const newItemGroup = ItemGroup.create({
      businessId: new UniqueEntityID(correctBusinessId),
      group: "ISS 5%",
      status: "active",
    });

    await inMemoryItemGroupRepository.create(newItemGroup);

    const result = await sut.execute({
      businessId: wrongBusinessId,
      groupId: newItemGroup.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an already deleted item group", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";

    const newItemGroup = ItemGroup.create({
      businessId: new UniqueEntityID(businessId),
      group: "Vegetais",
      status: "ACTIVE",
    });

    await inMemoryItemGroupRepository.create(newItemGroup);

    // First deletion
    await sut.execute({
      businessId,
      groupId: newItemGroup.id.toString(),
    });

    // Try to delete again
    const result = await sut.execute({
      businessId,
      groupId: newItemGroup.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should handle invalid UUID format", async () => {
    const result = await sut.execute({
      businessId: "invalid-uuid",
      groupId: "also-invalid-uuid",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.RESOURCE_NOT_FOUND");
  });

  it("should not be able to delete an inactive item group", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174000";
    const newItemGroup = ItemGroup.create({
      businessId: new UniqueEntityID(businessId),
      group: "Vegetais",
      status: "INACTIVE",
    });

    await inMemoryItemGroupRepository.create(newItemGroup);

    const result = await sut.execute({
      businessId,
      groupId: newItemGroup.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AppError);
    expect(result.value.message).toBe("errors.ITEM_GROUP_INACTIVE");
  });
});
