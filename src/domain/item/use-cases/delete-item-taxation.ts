import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { ItemTaxationRepository } from "@/domain/item/repositories/item-taxation-repository";
import { Injectable } from "@nestjs/common";

interface DeleteItemTaxationUseCaseRequest {
  businessId: string;
  taxationId: string;
}

type DeleteItemTaxationUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteItemTaxationUseCase {
  constructor(private itemTaxationRepository: ItemTaxationRepository) {}

  async execute({
    businessId,
    taxationId,
  }: DeleteItemTaxationUseCaseRequest): Promise<DeleteItemTaxationUseCaseResponse> {
    const itemTaxation = await this.itemTaxationRepository.findById(
      taxationId,
      businessId
    );
    if (!itemTaxation) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }
    if (!this.isValidUUID(businessId)) {
      return left(AppError.invalidParameter("errors.INVALID_BUSINESS_ID"));
    }

    if (!this.isValidUUID(taxationId)) {
      return left(AppError.invalidParameter("errors.INVALID_TAXATION_ID"));
    }
    if (businessId !== itemTaxation.businessId.toString()) {
      return left(AppError.notAllowed("errors.NOT_ALLOWED"));
    }
    await this.itemTaxationRepository.delete(itemTaxation);

    return right(null);
  }
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
