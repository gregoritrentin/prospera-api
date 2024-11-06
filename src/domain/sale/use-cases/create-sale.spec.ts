import { CreateSaleUseCase } from "@/domain/sale/use-cases/create-sale";
import { InMemorySalesRepository } from "test/repositories/in-memory-sale-repository";
import { I18nService } from "@/i18n/i18n.service";

// Mock I18nService
class MockI18nService implements Partial<I18nService> {
  translate(_key: string, _language?: string): string {
    return "Translated message"; // Mock translation
  }
}

describe("Create Sale", () => {
  let inMemorySalesRepository: InMemorySalesRepository;
  let i18nService: I18nService;
  let sut: CreateSaleUseCase;

  beforeEach(() => {
    inMemorySalesRepository = new InMemorySalesRepository();
    i18nService = new MockI18nService() as I18nService;
    sut = new CreateSaleUseCase(inMemorySalesRepository, i18nService);
  });

  it("should be able to create a sale", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      customerId: "123e4567-e89b-12d3-a456-426614174000",
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
      salesPersonId: "123e4567-e89b-12d3-a456-426614174000",
      channelId: "123e4567-e89b-12d3-a456-426614174000",
      issueDate: new Date(2024, 3, 4),
      status: "ACTIVE",
      notes: "notes",
      items: [
        {
          itemId: "123",
          itemDescription: "Test Item",
          quantity: 2,
          unitPrice: 100,
          discountAmount: 10,
          commissionAmount: 5,
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemorySalesRepository.items[0]).toEqual(result.value?.sale);
  });

  it("should calculate totals correctly", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      customerId: "123e4567-e89b-12d3-a456-426614174000",
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
      salesPersonId: "123e4567-e89b-12d3-a456-426614174000",
      channelId: "123e4567-e89b-12d3-a456-426614174000",
      issueDate: new Date(2024, 3, 4),
      status: "ACTIVE",
      notes: "notes",
      items: [
        {
          itemId: "123",
          itemDescription: "Test Item 1",
          quantity: 2,
          unitPrice: 100,
          discountAmount: 10,
          commissionAmount: 5,
        },
        {
          itemId: "124",
          itemDescription: "Test Item 2",
          quantity: 1,
          unitPrice: 50,
          discountAmount: 5,
          commissionAmount: 2,
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    const sale = result.value?.sale;

    // Total calculation: (2 * 100 - 10) + (1 * 50 - 5) = 190 + 45 = 235
    expect(sale?.amount).toBe(235);
    expect(sale?.discountAmount).toBe(15); // 10 + 5
    expect(sale?.commissionAmount).toBe(7); // 5 + 2
  });

  it("should create sale with null optional fields", async () => {
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174000",
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
      salesPersonId: "123e4567-e89b-12d3-a456-426614174000",
      issueDate: new Date(2024, 3, 4),
      status: "ACTIVE",
      notes: null,
      items: [
        {
          itemId: "123",
          itemDescription: "Test Item",
          quantity: 1,
          unitPrice: 100,
          discountAmount: 0,
          commissionAmount: 5,
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    const sale = result.value?.sale;

    expect(sale).toBeTruthy();
    expect(sale?.customerId).toBeUndefined();
    expect(sale?.channelId).toBeUndefined();
    expect(sale?.notes).toBeNull();
  });
});
