import { AppError } from "@/core/errors/app-errors";
import { DeleteSaleUseCase } from "@/domain/sale/use-cases/delete-sale";
import { InMemorySalesRepository } from "test/repositories/in-memory-sale-repository";

let inMemorySaleRepository: InMemorySalesRepository;
let sut: DeleteSaleUseCase;

describe("Delete Sale", () => {
  beforeEach(() => {
    inMemorySaleRepository = new InMemorySalesRepository();
    sut = new DeleteSaleUseCase(inMemorySaleRepository);
  });

  it("should be able to delete a sale", async () => {
    // Criar um sale com a estrutura correta
    const newSale = {
      saleId: "123e4567-e89b-12d3-a456-426614174020",
      businessId: "123e4567-e89b-12d3-a456-426614174022",
    };

    await inMemorySaleRepository.create(newSale);
    const deleteSpy = vi.spyOn(inMemorySaleRepository, "delete");
    const result = await sut.execute({
      saleId: newSale.saleId,
      businessId: newSale.businessId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemorySaleRepository.items).toHaveLength(0);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it("should not be able to delete a non-existing sale", async () => {
    const result = await sut.execute({
      saleId: "non-existing-id",
      businessId: "any-business-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a sale from different business", async () => {
    const newSale = {
      saleId: "123e4567-e89b-12d3-a456-426614174020",
      businessId: "123e4567-e89b-12d3-a456-426614174022",
    };
    await inMemorySaleRepository.create(newSale);
    const result = await sut.execute({
      saleId: newSale.saleId,
      businessId: "different-business-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(AppError.notAllowed("errors.NOT_ALLOWED"));
    expect(inMemorySaleRepository.items).toHaveLength(1);
  });
});
