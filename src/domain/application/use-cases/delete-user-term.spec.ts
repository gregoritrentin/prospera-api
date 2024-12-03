import { DeleteUserTermUseCase } from "@/domain/application/use-cases/delete-user-term";
import { InMemoryUserTermRepository } from "test/repositories/in-memory-user-term-repository";
import { UserTerm } from "@/domain/application/entities/user-term";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryUserTermRepository: InMemoryUserTermRepository;
let sut: DeleteUserTermUseCase;

describe("Delete UserTerm", () => {
  beforeEach(() => {
    inMemoryUserTermRepository = new InMemoryUserTermRepository();
    sut = new DeleteUserTermUseCase(inMemoryUserTermRepository);
  });

  it("should be able to delete a UserTerm", async () => {
    // Criar um userUserTerm com a estrutura correta
    const newUserTerm = {
      userTermId: "123e4567-e89b-12d3-a456-426614174020",
    };
    await inMemoryUserTermRepository.create(newUserTerm);

    const result = await sut.execute({
      userTermId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserTermRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a non-existent userTerm", async () => {
    const result = await sut.execute({
      userTermId: "non-existent-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        message: "errors.RESOURCE_NOT_FOUND",
      })
    );
  });

  it("should not be able to delete with an invalid ID", async () => {
    const result = await sut.execute({
      userTermId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        message: "errors.INVALID_USER_TERM_ID",
      })
    );
  });
});
