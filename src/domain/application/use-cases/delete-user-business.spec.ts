import { InMemoryuserBusinessRepository } from "test/repositories/in-memory-user-business-repository";
import { DeleteUserBusinessUseCase } from "./delete-user-business";
import { UserBusiness } from "../entities/user-business";
import { AppError } from "@/core/errors/app-errors";

let inMemoryUserBusinessRepository: InMemoryuserBusinessRepository;
let sut: DeleteUserBusinessUseCase;

describe("Delete UserBusiness", () => {
  beforeEach(() => {
    inMemoryUserBusinessRepository = new InMemoryuserBusinessRepository();
    sut = new DeleteUserBusinessUseCase(inMemoryUserBusinessRepository);
  });

  it("should be able to delete a user business", async () => {
    // Criar um user business com a estrutura correta
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    const result = await sut.execute({
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserBusinessRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a non-existing userBusiness", async () => {
    const result = await sut.execute({
      userBusinessId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a userBusiness with empty id", async () => {
    const result = await sut.execute({
      userBusinessId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_TERM_ID")
    );
  });

  it("should not be able to delete an already deleted userBusiness", async () => {
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    } as UserBusiness;

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    // Primeira deleção
    await sut.execute({
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    });

    // Tentativa de segunda deleção
    const result = await sut.execute({
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call repository delete method with correct userBusiness", async () => {
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    } as UserBusiness;

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    const deleteSpy = vi.spyOn(inMemoryUserBusinessRepository, "delete");

    await sut.execute({
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(deleteSpy).toHaveBeenCalledWith(newUserBusiness);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it("should verify if userBusiness was actually deleted from repository", async () => {
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    } as UserBusiness;

    await inMemoryUserBusinessRepository.create(newUserBusiness);
    await sut.execute({
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    });

    const remainingUserBusiness = await inMemoryUserBusinessRepository.findById(
      "123e4567-e89b-12d3-a456-426614174020"
    );

    expect(remainingUserBusiness).toBeNull();
  });
});
