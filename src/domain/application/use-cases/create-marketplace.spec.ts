
import { CreateMarketplaceUseCase } from "@/domain/application/use-cases/create-Marketplace";
import { InMemorymarketplaceRepository } from "test/repositories/in-memory-marketplace";

let inMemoryMarketplaceRepository: InMemorymarketplaceRepository;
let sut: CreateMarketplaceUseCase;

describe("Create Marketplace", () => {
  beforeEach(() => {
    inMemoryMarketplaceRepository = new InMemorymarketplaceRepository();
    sut = new CreateMarketplaceUseCase(inMemoryMarketplaceRepository);
  });

  it("should be able to create a Marketplace", async () => {
    const result = await sut.execute({
      name: "Gregori Trentin",
      document: "1234.5.67-8901",
      status: "PENDING",
    });

    expect(result.isRight()).toBe(true);


    expect(inMemoryMarketplaceRepository.items[0]).toEqual(result.value?.marketplace);
  });

  it("should persist Marketplace data correctly", async () => {
    const result = await sut.execute({
        name: 'Gregori Trentin',
        document: '1234.5.67-8901',
       status: 'PENDING',
    });

    expect(result.isRight()).toBe(true);

    const createdMarketplace = result.value?.marketplace    

    expect(createdMarketplace).toBeTruthy();
    expect(createdMarketplace?.name).toBe("Gregori Trentin");
    expect(createdMarketplace?.document).toBe("1234.5.67-8901");
    expect(createdMarketplace?.status).toBe("PENDING");
  });

});
