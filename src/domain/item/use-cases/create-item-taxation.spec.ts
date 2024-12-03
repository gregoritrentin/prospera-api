import { CreateItemTaxationUseCase } from "@/domain/item/use-cases/create-item-taxation";
import { InMemoryItemTaxationRepository } from "test/repositories/in-memory-item-taxation-repository";

let inMemoryItemTaxationRepository: InMemoryItemTaxationRepository;
let sut: CreateItemTaxationUseCase;

describe("Create ItemTaxation", () => {
  beforeEach(() => {
    inMemoryItemTaxationRepository = new InMemoryItemTaxationRepository();
    sut = new CreateItemTaxationUseCase(inMemoryItemTaxationRepository);
  });

  it("should be able to create a ItemTaxation", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      taxation: "Impessoras",
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);
  });

  it("should persist ItemTaxation data correctly", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      taxation: "Impessoras",
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);

    const createdItemTaxation = result.value?.itemTaxation;

    expect(createdItemTaxation).toBeTruthy();

    expect(createdItemTaxation?.businessId.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    expect(createdItemTaxation?.taxation).toEqual("Impessoras");
    expect(createdItemTaxation?.status).toEqual("ACTIVE");
  });
});
