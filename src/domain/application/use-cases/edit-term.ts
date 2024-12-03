import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { Term } from "@/domain/application/entities/term";
import { TermRepository } from "@/domain/application/repositories/term-repository";
import { Injectable } from "@nestjs/common";

interface EditTermUseCaseRequest {
  termId: string;
  title: string;
  content: string;
  language: string;
  startAt: Date;
}

type EditTermUseCaseResponse = Either<
  AppError,
  {
    term: Term;
  }
>;

@Injectable()
export class EditTermUseCase {
  constructor(private termRepository: TermRepository) {}

  async execute({
    termId,
    title,
    content,
    language,
    startAt,
  }: EditTermUseCaseRequest): Promise<EditTermUseCaseResponse> {
    const term = await this.termRepository.findById(termId);

    if (!term) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    //  erro de titulo
    if (!title || title.trim() === "") {
      return left(AppError.badRequest("O título não pode estar vazio"));
    }

    // 📝 Validações de conteúdo
    if (!content || content.trim() === "" || content === "INVALID_STATUS") {
      return left(AppError.invalidData("Conteúdo inválido ou vazio"));
    }
    //  erro de conteudo
    if (!content || content.trim() === "" || content === "INVALID_STATUS") {
      return left(AppError.invalidData("Conteúdo inválido ou vazio"));
    }

    term.title = title;
    term.content = content;
    term.language = language;
    term.startAt = startAt;

    await this.termRepository.save(term);

    return right({
      term,
    });
  }
}
