import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { UserTermRepository } from "../repositories/user-term-repository";
import { AppError } from "@/core/errors/app-errors";

interface DeleteUserTermUseCaseRequest {
  userTermId: string;
}

type DeleteUserTermUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteUserTermUseCase {
  constructor(private userTermRepository: UserTermRepository) {}

  async execute({
    userTermId,
  }: DeleteUserTermUseCaseRequest): Promise<DeleteUserTermUseCaseResponse> {
    // Primeira verificação: ID é válido?
    if (!userTermId) {
      return left(AppError.invalidParameter("errors.INVALID_USER_TERM_ID"));
    }

    // Só depois busca o UserTerm
    const userTerm = await this.userTermRepository.findById(userTermId);

    if (!userTerm) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    await this.userTermRepository.delete(userTerm);

    // Verificação adicional de deleção
    const remainingUserTerm =
      await this.userTermRepository.findById(userTermId);
    if (remainingUserTerm) {
      return left(AppError.unexpected("errors.DELETE_OPERATION_FAILED"));
    }

    return right(null);
  }
}
