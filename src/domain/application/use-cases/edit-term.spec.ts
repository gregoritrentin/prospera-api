import { InMemorytermRepository } from "test/repositories/in-memory-term-repository";
import { EditTermUseCase } from "@/domain/application/use-cases/edit-term";
import { AppError } from "@/core/errors/app-errors";
import { Term } from "../entities/term";

describe("EditTermUseCase", () => {
  let useCase: EditTermUseCase;
  let termRepository: InMemorytermRepository;

  beforeEach(() => {
    termRepository = new InMemorytermRepository();
    useCase = new EditTermUseCase(termRepository);
  });

  // Casos de teste existentes (os anteriores)
  it("should be able to edit a term", async () => {
    const newTerm = Term.create({
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });
    newTerm.termId = "term-1";
    termRepository.items.push(newTerm);

    const result = await useCase.execute({
      termId: "term-1",
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.term.title).toBe("Term title");
      expect(result.value.term.content).toBe("Term content");
      expect(result.value.term.language).toBe("PORTUGUESE");
      expect(result.value.term.startAt).toEqual(new Date(30, 1, 1));
    }
  });

  // Cenário de term não encontrado
  it("should return an error when term is not found", async () => {
    const result = await useCase.execute({
      termId: "non-existent-id",
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("NOT_FOUND");
    }
  });

  // NOVOS CENÁRIOS DE TESTE

  // Validação de nome
  it("should not allow empty title", async () => {
    const newTerm = Term.create({
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });
    newTerm.termId = "term-1";
    termRepository.items.push(newTerm);

    const result = await useCase.execute({
      termId: "term-1",
      title: "", // Tittle vazio
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("BAD_REQUEST");
    }
  });

  // Validação de content
  it("should not allow invalid content", async () => {
    const newTerm = Term.create({
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });
    newTerm.termId = "term-1";
    termRepository.items.push(newTerm);

    const result = await useCase.execute({
      termId: "term-1",
      title: "Term title",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
      content: "INVALID_STATUS", // Status inválido
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(AppError);
      expect(result.value.errorCode).toBe("INVALID_DATA");
    }
  });
});
