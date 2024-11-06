import { CreateItemUseCase } from "@/domain/item/use-cases/create-item";
import { InMemoryItemsRepository } from "test/repositories/in-memory-item-repository";

let inMemoryItemsRepository: InMemoryItemsRepository;
let sut: CreateItemUseCase;

describe("Create Item", () => {
  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    sut = new CreateItemUseCase(inMemoryItemsRepository);
  });

  it("should be able to create a item", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      description: "PAN",
      idAux: "REF123",
      itemType: "PRODUCT",
      unit: "kg",
      price: 23.5,
      ncm: "5",
      taxationId: "123e4567-e89b-12d3-a456-426614174020",
      groupId: "123e4567-e89b-12d3-a456-426614174022",
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryItemsRepository.items[0]).toEqual(result.value?.item);
  });

  it("should persist item data correctly", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      description: "PAN",
      idAux: "REF123",
      itemType: "PRODUCT",
      unit: "kg",
      price: 23.5,
      ncm: "5",
      taxationId: "123e4567-e89b-12d3-a456-426614174020",
      groupId: "123e4567-e89b-12d3-a456-426614174022",
      status: "ACTIVE",
    });

    const createdItem = result.value?.item;

    expect(createdItem).toBeTruthy();

    //quando for uuid, usar o .businessId.value
    expect(createdItem?.description).toEqual("PAN");
    expect(createdItem?.unit).toEqual("kg");
    expect(createdItem?.price).toEqual(23.5);
    expect(createdItem?.businessId.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174000"
    );

    expect(createdItem?.taxationId?.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174020"
    );

    expect(createdItem?.groupId?.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174022"
    );
  });

  it("should create item with null optional fields (addressLine3 and notes)", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      description: "PAN",
      idAux: "REF123",
      itemType: "PRODUCT",
      unit: "kg",
      price: 23.5,
      ncm: null,
      taxationId: null,
      groupId: null,
      status: "ACTIVE",
    });

    expect(result.isRight()).toBe(true);

    const createdItem = result.value?.item;

    // Verifica se a pessoa foi criada com sucesso
    expect(createdItem).toBeTruthy();

    // Verifica especificamente os campos opcionais
    expect(createdItem?.ncm).toBeNull();
    expect(createdItem?.taxationId).toBeNull();
    expect(createdItem?.groupId).toBeNull();

    // Verifica se os outros campos obrigatórios continuam corretos
    expect(createdItem?.businessId.toString()).toEqual(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    expect(createdItem?.description).toEqual("PAN");
    expect(createdItem?.unit).toEqual("kg");

    // Verifica se o objeto foi persistido corretamente no repositório
    expect(inMemoryItemsRepository.items[0]).toEqual(createdItem);
  });
});
