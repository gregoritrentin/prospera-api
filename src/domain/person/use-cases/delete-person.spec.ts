import { DeletePersonUseCase } from "@/domain/person/use-cases/delete-person";
import { InMemoryPersonsRepository } from "test/repositories/in-memory-persons-repository";
import { Person } from "@/domain/person/entities/person";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AppError } from "@/core/errors/app-errors";
import { describe, it, expect, beforeEach, vi } from "vitest"; // Importação do Vitest

let inMemoryPersonRepository: InMemoryPersonsRepository;
let sut: DeletePersonUseCase;

describe("Delete Person", () => {
  beforeEach(() => {
    inMemoryPersonRepository = new InMemoryPersonsRepository();
    sut = new DeletePersonUseCase(inMemoryPersonRepository);
  });

  it("should be able to delete a person", async () => {
    const personId = "123e4567-e89b-12d3-a456-426614174020";
    const businessId = "123e4567-e89b-12d3-a456-426614174022";

    const newPerson = Person.create(
      {
        businessId: new UniqueEntityID(businessId),
        name: "",
        email: "",
        phone: "",
        document: "",
        addressLine1: "",
        addressLine2: "",
        neighborhood: "",
        postalCode: "",
        countryCode: "",
        stateCode: "",
        cityCode: "",
        status: "",
      },
      new UniqueEntityID(personId)
    );

    await inMemoryPersonRepository.create(newPerson);

    // Se quiser usar o spy, use vi ao invés de jest
    const deleteSpy = vi.spyOn(inMemoryPersonRepository, "delete");

    const result = await sut.execute({
      personId,
      businessId,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPersonRepository.items).toHaveLength(0);
    expect(deleteSpy).toHaveBeenCalledWith(newPerson);
  });

  it("should not be able to delete a non existing person", async () => {
    const result = await sut.execute({
      personId: "non-existing-id",
      businessId: "any-business-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a person from different business", async () => {
    const personId = "123e4567-e89b-12d3-a456-426614174020";
    const businessId = "123e4567-e89b-12d3-a456-426614174022";

    const newPerson = Person.create(
      {
        businessId: new UniqueEntityID(businessId),
        name: "",
        email: "",
        phone: "",
        document: "",
        addressLine1: "",
        addressLine2: "",
        neighborhood: "",
        postalCode: "",
        countryCode: "",
        stateCode: "",
        cityCode: "",
        status: "",
      },
      new UniqueEntityID(personId)
    );

    await inMemoryPersonRepository.create(newPerson);

    const result = await sut.execute({
      personId,
      businessId: "different-business-id",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(AppError.notAllowed("errors.NOT_ALLOWED"));
    expect(inMemoryPersonRepository.items).toHaveLength(1);
  });
});
