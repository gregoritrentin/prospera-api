import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { ItemRepository } from "@/domain/item/repositories/item-repository";
import { Injectable } from "@nestjs/common";

interface DeleteItemUseCaseRequest {
  businessId: string;
  itemId: string;
}

type DeleteItemUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteItemUseCase {
  constructor(private itemRepository: ItemRepository) {}

  async execute({
    businessId,
    itemId,
  }: DeleteItemUseCaseRequest): Promise<DeleteItemUseCaseResponse> {
    if (!businessId || !itemId) {
      return left(AppError.invalidParameter("errors.INVALID_TERM_ID"));
    }
    const item = await this.itemRepository.findById(itemId, businessId);

    if (!item) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    if (businessId !== item.businessId.toString()) {
      return left(AppError.notAllowed("errors.NOT_ALLOWED"));
    }

    await this.itemRepository.delete(item);

    return right(null);
  }
}
