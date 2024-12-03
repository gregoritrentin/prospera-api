import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { TermRepository } from "@/domain/application/repositories/term-repository";
import { Injectable } from "@nestjs/common";

interface DeleteTermUseCaseRequest {
  termId: string;
}

type DeleteTermUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteTermUseCase {
  constructor(private termRepository: TermRepository) {}

  async execute({
    termId,
  }: DeleteTermUseCaseRequest): Promise<DeleteTermUseCaseResponse> {
    if (!termId) {
      return left(AppError.invalidParameter("errors.INVALID_TERM_ID"));
    }

    const term = await this.termRepository.findById(termId);

    if (!term) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    await this.termRepository.delete(term);

    // Verificar se o termo foi realmente deletado
    const remainingTerm = await this.termRepository.findById(termId);
    if (remainingTerm) {
      return left(AppError.unexpected("errors.DELETE_OPERATION_FAILED"));
    }

    return right(null);
  }
}
