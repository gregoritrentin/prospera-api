import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { BusinessAppRepository } from "@/domain/application/repositories/business-app-repository";
import { Injectable } from "@nestjs/common";

interface DeleteBusinessAppUseCaseRequest {
  appId: string;
}

type DeleteBusinessAppUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteAppUseCase {
  constructor(private businessAppRepository: BusinessAppRepository) {}

  async execute({
    appId,
  }: DeleteBusinessAppUseCaseRequest): Promise<DeleteBusinessAppUseCaseResponse> {
    const businessApp = await this.businessAppRepository.findById(appId);

    if (!businessApp) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    await this.businessAppRepository.delete(businessApp);

    return right(null);
  }
}
