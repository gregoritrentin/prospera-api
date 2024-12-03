import { InMemoryuserBusinessRepository } from "test/repositories/in-memory-user-business-repository";
import { EditUserBusinessUseCase } from "./edit-user-business";
import { UserBusiness } from "../entities/user-business";
import { AppError } from "@/core/errors/app-errors";

let inMemoryUserBusinessRepository: InMemoryuserBusinessRepository;
let sut: EditUserBusinessUseCase;

describe("Edit UserBusiness", () => {
  beforeEach(() => {
    inMemoryUserBusinessRepository = new InMemoryuserBusinessRepository();
    sut = new EditUserBusinessUseCase(inMemoryUserBusinessRepository);
  });

  it("should be able to edit a user business", async () => {
    // Criar um user business com a estrutura correta
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    };

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    const result = await sut.execute({
      userbusinessId: "123e4567-e89b-12d3-a456-426614174020",
      status: "active",
      role: "admin",
    });

    expect(result.isRight()).toBe(true);
  });

  it("should not be able to edit a non-existing userBusiness", async () => {
    const result = await sut.execute({
      userbusinessId: "non-existing-id",
      status: "active",
      role: "admin",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to edit a userBusiness with empty id", async () => {
    const result = await sut.execute({
      userbusinessId: "",
      status: "active",
      role: "admin",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_TERM_ID")
    );
  });

  it("should not be able to edit an already edited userBusiness", async () => {
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    } as UserBusiness;

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call repository edit method with correct userBusiness", async () => {
    const newUserBusiness = {
      userBusinessId: "123e4567-e89b-12d3-a456-426614174020",
    } as UserBusiness;

    await inMemoryUserBusinessRepository.create(newUserBusiness);

    const editSpy = vi.spyOn(inMemoryUserBusinessRepository, "save");

    await sut.execute({
      userbusinessId: "123e4567-e89b-12d3-a456-426614174020",
      status: "active",
      role: "admin",
    });

    expect(editSpy).toHaveBeenCalledWith(newUserBusiness);
    expect(editSpy).toHaveBeenCalledTimes(1);
  });
});
