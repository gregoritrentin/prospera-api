import { DeleteBusinessOwnerUseCase } from "@/domain/application/use-cases/delete-business-owner";
import { InMemoryBusinessOwnerRepository } from "test/repositories/in-memory-business-owner-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { BusinessOwner } from "../entities/business-owner";

let inMemoryBusinessOwnersRepository: InMemoryBusinessOwnerRepository;
let sut: DeleteBusinessOwnerUseCase;

describe("Delete BusinessOwner", () => {
  beforeEach(() => {
    inMemoryBusinessOwnersRepository = new InMemoryBusinessOwnerRepository();
    sut = new DeleteBusinessOwnerUseCase(inMemoryBusinessOwnersRepository);
  });

  it("should be able to delete a business owner", async () => {
    const newBusinessOwner = {
      businessId: new UniqueEntityID("123e4567-e89b-12d3-a456-426614174020"),
      name: "Gregori Trentin",
      email: "gregori.trentin@br.com",
      phone: "54999677390",
      document: "1234.5.67-8901",
      addressLine1: "Rua Maria Clara Badalotti Tormen",
      addressLine2: "145",
      addressLine3: "Em frente a praça",
      neighborhood: "Em frente a praça",
      postalCode: "99709-462",
      countryCode: "1058",
      stateCode: "43",
      cityCode: "4307005",
      birthDate: new Date(1984 - 10 - 10),
      status: "PENDING",
      ownerType: "owner",
    };
    await inMemoryBusinessOwnersRepository.create(newBusinessOwner);
    await sut.execute({ businessOwnerId: "550e8400-e29b-41d4-a716" });
    expect(inMemoryBusinessOwnersRepository.items).toHaveLength(0);
  });
});
