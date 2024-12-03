import { CreateItemGroupUseCase } from "@/domain/item/use-cases/create-item-group";
import { InMemoryItemGroupRepository } from "test/repositories/in-memory-item-group-repository";

let inMemoryItemGroupRepository: InMemoryItemGroupRepository;
let sut: CreateItemGroupUseCase;

describe("Create ItemGroup", () => {
  beforeEach(() => {
    inMemoryItemGroupRepository = new InMemoryItemGroupRepository();
    sut = new CreateItemGroupUseCase(inMemoryItemGroupRepository);
  });

  it("should be able to create a ItemGroup", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      group: "Impessoras",
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryItemGroupRepository.itemGroups[0]).toEqual(
      result.value?.itemGroup
    );
  });

  it("should persist ItemGroup data correctly", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      group: "Vegetais",
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);

    const createdItemGroup = result.value?.itemGroup;

    expect(createdItemGroup).toBeTruthy();
    expect(createdItemGroup?.businessId.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    expect(createdItemGroup?.group).toEqual("Vegetais");
    expect(createdItemGroup?.status).toEqual("ACTIVE");
  });
});
