import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { ItemGroupRepository } from "@/domain/item/repositories/item-group-repository";
import { Injectable } from "@nestjs/common";

interface DeleteItemGroupUseCaseRequest {
  businessId: string;
  groupId: string;
}

type DeleteItemGroupUseCaseResponse = Either<AppError, null>;

@Injectable()
export class DeleteItemGroupUseCase {
  constructor(private itemGroupRepository: ItemGroupRepository) {}

  async execute({
    businessId,
    groupId,
  }: DeleteItemGroupUseCaseRequest): Promise<DeleteItemGroupUseCaseResponse> {
    const itemGroup = await this.itemGroupRepository.findById(
      groupId,
      businessId
    );

    if (!itemGroup) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    if (businessId !== itemGroup.businessId.toString()) {
      return left(AppError.notAllowed("errors.NOT_ALLOWED"));
    }

    if (itemGroup.status === "INACTIVE") {
      return left(AppError.invalidParameter("errors.ITEM_GROUP_INACTIVE"));
    }

    await this.itemGroupRepository.delete(itemGroup);

    return right(null);
  }
}
