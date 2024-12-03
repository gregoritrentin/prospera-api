import { DeleteTermUseCase } from "@/domain/application/use-cases/delete-term";
import { InMemorytermRepository } from "test/repositories/in-memory-term-repository";
import { Term } from "@/domain/application/entities/term";
import { AppError } from "@/core/errors/app-errors";

let inMemoryTermRepository: InMemorytermRepository;
let sut: DeleteTermUseCase;

describe("Delete Term", () => {
  beforeEach(() => {
    inMemoryTermRepository = new InMemorytermRepository();
    sut = new DeleteTermUseCase(inMemoryTermRepository);
  });

  it("should be able to delete a term", async () => {
    const newTerm = {
      termId: "123e4567-e89b-12d3-a456-426614174020",
    } as Term;

    await inMemoryTermRepository.create(newTerm);

    const result = await sut.execute({
      termId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTermRepository.items).toHaveLength(0);

    // Verificação adicional para garantir que o termo foi completamente removido
    const deletedTerm = await inMemoryTermRepository.findById(
      "123e4567-e89b-12d3-a456-426614174020"
    );
    expect(deletedTerm).toBeNull();
  });

  it("should not be able to delete a non-existing term", async () => {
    const result = await sut.execute({
      termId: "non-existing-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should not be able to delete a term with empty id", async () => {
    const result = await sut.execute({
      termId: "",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.invalidParameter("errors.INVALID_TERM_ID")
    );
  });

  it("should not be able to delete an already deleted term", async () => {
    const newTerm = {
      termId: "123e4567-e89b-12d3-a456-426614174020",
    } as Term;

    await inMemoryTermRepository.create(newTerm);

    // Primeira deleção
    await sut.execute({
      termId: "123e4567-e89b-12d3-a456-426614174020",
    });

    // Tentativa de segunda deleção
    const result = await sut.execute({
      termId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND")
    );
  });

  it("should call repository delete method with correct term", async () => {
    const newTerm = {
      termId: "123e4567-e89b-12d3-a456-426614174020",
    } as Term;

    await inMemoryTermRepository.create(newTerm);

    const deleteSpy = vi.spyOn(inMemoryTermRepository, "delete");

    await sut.execute({
      termId: "123e4567-e89b-12d3-a456-426614174020",
    });

    expect(deleteSpy).toHaveBeenCalledWith(newTerm);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it("should verify if term was actually deleted from repository", async () => {
    const newTerm = {
      termId: "123e4567-e89b-12d3-a456-426614174020",
    } as Term;

    await inMemoryTermRepository.create(newTerm);
    await sut.execute({
      termId: "123e4567-e89b-12d3-a456-426614174020",
    });

    const remainingTerm = await inMemoryTermRepository.findById(
      "123e4567-e89b-12d3-a456-426614174020"
    );

    if (remainingTerm) {
      expect(result.isLeft()).toBe(true);
      expect(result.value).toEqual(
        AppError.unexpected("errors.DELETE_OPERATION_FAILED")
      );
    }
  });
});
