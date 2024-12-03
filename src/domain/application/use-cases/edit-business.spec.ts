import { AppError } from "@/core/errors/app-errors";
import { EditBusinessUseCase } from "@/domain/application/use-cases/edit-business";
import { InMemoryBusinessRepository } from "test/repositories/in-memory-business-repository";

let inMemoryBusinessRepository: InMemoryBusinessRepository;
let sut: EditBusinessUseCase;

describe("Edit Business", () => {
  beforeEach(() => {
    inMemoryBusinessRepository = new InMemoryBusinessRepository();
    sut = new EditBusinessUseCase(inMemoryBusinessRepository);
  });

  it("should be able to edit a business", async () => {
    // Criar um business antes de editar
    const newBusiness = {
      businessId: "123e4567-e89b-12d3-a456-426614174020",
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
      status: "ACTIVE",
    };

    await inMemoryBusinessRepository.create(newBusiness);

    await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
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
      status: "ACTIVE",
    });
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
      marketplaceId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Novo Nome",
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
      status: "ACTIVE",
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryBusinessRepository.items).toHaveLength(1);
    const editedBusiness = inMemoryBusinessRepository.items[0];
    expect(editedBusiness.name).toBe("Novo Nome");
  });

  it("should not be able to edit a non-existing business ", async () => {
    const result = await sut.execute({
      businessId: "non-existing-id",
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
      status: "ACTIVE",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to edit a business that is already edited", async () => {
    await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
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
      status: "ACTIVE",
    });
    const result = await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
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
      status: "ACTIVE",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to edit a business with an invalid businessId", async () => {
    const result = await sut.execute({
      businessId: "",
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
      status: "ACTIVE",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call the edit method of the repository with the correct business", async () => {
    const newBusiness = {
      businessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryBusinessRepository.create(newBusiness);
    const editSpy = vi.spyOn(inMemoryBusinessRepository, "save");
    await sut.execute({
      businessId: "123e4567-e89b-12d3-a456-426614174020",
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
      status: "ACTIVE",
    });
    expect(editSpy).toHaveBeenCalledWith(newBusiness);
  });
});
