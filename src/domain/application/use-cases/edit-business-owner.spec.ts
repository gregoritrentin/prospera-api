import { EditBusinessOwnerUseCase } from "@/domain/application/use-cases/edit-business-owner";
import { InMemoryBusinessOwnerRepository } from "test/repositories/in-memory-business-owner-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AppError } from "@/core/errors/app-errors";

let inMemoryBusinessOwnersRepository: InMemoryBusinessOwnerRepository;
let sut: EditBusinessOwnerUseCase;

describe("Edit BusinessOwner", () => {
  beforeEach(() => {
    inMemoryBusinessOwnersRepository = new InMemoryBusinessOwnerRepository();
    sut = new EditBusinessOwnerUseCase(inMemoryBusinessOwnersRepository);
  });

  it("should be able to edit a business owner", async () => {
    const businessId = "123e4567-e89b-12d3-a456-426614174020";
    const newBusinessOwner = {
      businessId: new UniqueEntityID(businessId),
    };

    await inMemoryBusinessOwnersRepository.create(newBusinessOwner);

    const editSpy = vi.spyOn(inMemoryBusinessOwnersRepository, "save");
    const result = await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
      name: "Gregori Trentin",
      email: "gregori.trentin@br.com",
      phone: "54999677390",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      status: "PENDING",
      ownerType: "owner",
    });
    expect(editSpy).toHaveBeenCalledWith(newBusinessOwner);
    expect(result.isRight()).toBe(true);
  });

  it("should not be able to edit with invalid UUID", async () => {
    const result = await sut.execute({
      businessOwnerId: "invalid-uuid",
      name: "Gregori Trentin",
      email: "gregori.trentin@br.com",
      phone: "54999677390",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      status: "PENDING",
      ownerType: "owner",
    });

    expect(result.isLeft()).toBe(true);
  });

  it("should not be able to edit a non-existing business owner", async () => {
    const result = await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
      name: "Gregori Trentin",
      email: "gregori.trentin@br.com",
      phone: "54999677390",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      status: "PENDING",
      ownerType: "owner",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  // Teste: Nome não pode ser vazio
  it("should not edit business owner with empty name", async () => {
    const result = await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
      name: "",
      email: "gregori.trentin@br.com",
      phone: "54999677390",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      status: "PENDING",
      ownerType: "owner",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_NAME")
    );
  });

  // Teste: E-mail inválido
  it("should not edit business owner with invalid email", async () => {
    const result = await sut.execute({
      businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
      name: "Gregori Trentin",
      email: "invalid-email",
      phone: "54999677390",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      status: "PENDING",
      ownerType: "owner",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_EMAIL")
    );
  });

  //   // Teste: Telefone inválido
  //   it("should not edit business owner with invalid phone", async () => {
  //     const result = await sut.execute({
  //       businessOwnerId: "123e4567-e89b-12d3-a456-426614174020",
  //       name: "Gregori Trentin",
  //       email: "gregori.trentin@br.com",
  //       phone: "123", // Telefone muito curto
  //       addressLine1: "Rua Maria Clara Badalotti Tormen",
  //       addressLine2: "145",
  //       addressLine3: "Em frente a praça",
  //       neighborhood: "Em frente a praça",
  //       postalCode: "99709-462",
  //       countryCode: "1058",
  //       stateCode: "43",
  //       cityCode: "4307005",
  //       status: "PENDING",
  //       ownerType: "owner",
  //     });

  //     expect(result.isLeft()).toBe(true);
  //     expect(result.value).toEqual(
  //       AppError.invalidParameter("errors.INVALID_PHONE")
  //     );
  //   });
});
