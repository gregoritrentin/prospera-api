import { Business } from "@/domain/application/entities/business";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CreateBusinessUseCase } from "@/domain/application/use-cases/create-business";
import { InMemoryBusinessRepository } from "test/repositories/in-memory-business-repository";

let inMemoryBusinessRepository: InMemoryBusinessRepository;
let sut: CreateBusinessUseCase;

describe("Create business", () => {
  beforeEach(() => {
    inMemoryBusinessRepository = new InMemoryBusinessRepository();
    sut = new CreateBusinessUseCase(inMemoryBusinessRepository);
  });

  it("should be able to create a business", async () => {
    const result = await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Gregori Trentin",
      phone: "54999677390",
      email: "gregori.trentin@br.com",
      document: "1234.5.67-8901",
      ie: "4535",
      im: "4535",
      addressLine1: "Arvore",
      addressLine2: "145",
      addressLine3: "jd. das 145",
      neighborhood: "São Paulo",
      postalCode: "12345-678",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      businessSize: "SMALL",
      businessType: "3334r",
      foundingDate: new Date("1984-10-10"),
      logoFileId: "r5465g56-4363",
      digitalCertificateFileId: "255745u5",
    });

    expect(result.isRight()).toBe(true);

    // Forma 1: Type Guard com if
    if (!result.isRight()) {
      throw new Error("Result should be right");
    }

    expect(inMemoryBusinessRepository.items[0]).toEqual(result.value.business);
  });

  it("should persist business data correctly", async () => {
    const result = await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Gregori Trentin",
      phone: "54999677390",
      email: "gregori.trentin@br.com",
      document: "1234.5.67-8901",
      ie: "4535",
      im: "4535",
      addressLine1: "Arvore",
      addressLine2: "145",
      addressLine3: "jd. das 145",
      neighborhood: "São Paulo",
      postalCode: "12345-678",
      countryCode: "BR",
      stateCode: "25447 ",
      cityCode: "165",
      businessSize: "2",
      businessType: "3334r",
      foundingDate: new Date("1984-10-10"),
      logoFileId: "r5465g56-4363",
      digitalCertificateFileId: "255745u5",
    });

    expect(result.isRight()).toBe(true);

    // Forma 2: Type assertion com as
    const createdBusiness = (result.isRight() ? result.value : null) as {
      business: Business;
    };

    expect(createdBusiness).toBeTruthy();
    expect(createdBusiness.business.name).toBe("Gregori Trentin");
    expect(createdBusiness.business.email).toBe("gregori.trentin@br.com");
    expect(createdBusiness.business.phone).toBe("54999677390");
    expect(createdBusiness.business.document).toBe("1234.5.67-8901");
    expect(createdBusiness.business.countryCode).toBe("BR");
    expect(createdBusiness.business.stateCode).toBe("25447 ");
    expect(createdBusiness.business.foundingDate).toEqual(
      new Date("1984-10-10")
    );
  });

  it("should persist business data correctly with null optional fields", async () => {
    const result = await sut.execute({
      marketplaceId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Gregori Trentin",
      phone: "54999677390",
      email: "gregori.trentin@br.com",
      document: "1234.5.67-8901",
      ie: "4535",
      im: "4535",
      addressLine1: "Arvore",
      addressLine2: "145",
      addressLine3: null,
      neighborhood: "São Paulo",
      postalCode: "12345-678",
      countryCode: "BR",
      stateCode: "25447 ",
      cityCode: "165",
      businessSize: "2",
      businessType: "3334r",
      foundingDate: new Date("1984-10-10"),
      logoFileId: "r5465g56-4363",
      digitalCertificateFileId: "255745u5",
    });

    expect(result.isRight()).toBe(true);

    // Forma 1: Type Guard com if
    if (!result.isRight()) {
      throw new Error("Result should be right");
    }

    const createdBusiness = result.value.business;
    expect(createdBusiness).toBeTruthy();
    expect(createdBusiness.addressLine3).toBeNull();
    expect(createdBusiness.name).toBe("Gregori Trentin");
    expect(createdBusiness.addressLine1).toBe("Arvore");
    expect(createdBusiness.addressLine2).toBe("145");
    expect(inMemoryBusinessRepository.items[0]).toEqual(createdBusiness);
  });
});
