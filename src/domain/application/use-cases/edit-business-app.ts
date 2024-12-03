import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { BusinessAppRepository } from "@/domain/application/repositories/business-app-repository";
import { BusinessApp } from "@/domain/application/entities/business-app";

interface EditBusinessAppUseCaseRequest {
  businessAppId: string;
  price?: number;
  quantity?: number;
  status?: string;
  name?: string;
}

type EditBusinessAppUseCaseResponse = Either<
  AppError,
  {
    businessApp: BusinessApp;
  }
>;

export class EditBusinessAppUseCase {
  constructor(private businessAppRepository: BusinessAppRepository) {}
  async execute({
    businessAppId,
    price,
    quantity,
    status,
    name,
  }: EditBusinessAppUseCaseRequest): Promise<EditBusinessAppUseCaseResponse> {
    // Validações antes de buscar o registro
    if (price !== undefined && price < 0) {
      return left(AppError.invalidData("errors.INVALID_PRICE"));
    }

    if (quantity !== undefined && quantity < 0) {
      return left(AppError.invalidData("errors.INVALID_QUANTITY"));
    }

    // Validações para nome, se fornecido
    if (name !== undefined) {
      if (name.trim() === "") {
        return left(AppError.invalidData("errors.EMPTY_NAME"));
      }
    }

    // Busca o registro
    const businessApp =
      await this.businessAppRepository.findById(businessAppId);

    if (!businessApp) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    // Atualiza as propriedades
    if (price !== undefined) {
      businessApp.price = price;
    }

    if (quantity !== undefined) {
      businessApp.quantity = quantity;
    }

    if (name !== undefined) {
      businessApp.name = name;
    }

    if (status !== undefined) {
      businessApp.status = status;
    }

    // Salva as alterações
    await this.businessAppRepository.save(businessApp);

    return right({
      businessApp,
    });
  }
}
