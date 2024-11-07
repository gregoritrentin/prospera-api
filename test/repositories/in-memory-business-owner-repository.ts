import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { BusinessOwnerRepository } from "@/domain/application/repositories/business-owner-repository";
import { BusinessOwner } from "@/domain/application/entities/business-owner";
import { NotImplementedException } from "@nestjs/common";

export class InMemoryBusinessOwnerRepository
  implements BusinessOwnerRepository
{
  public items: BusinessOwner[] = [];

  constructor() {}

  async findById(id: string): Promise<BusinessOwner | null> {
    const businessOwner = this.items.find(
      (item) => item.businessId.toString() === id
    );

    if (!businessOwner) {
      return null;
    }

    return businessOwner;
  }

  async findMany(businessId: string): Promise<BusinessOwner[]> {
    {
      throw new NotImplementedException("Method setLogo not implemented");
    }
  }

  async create(businessOwner: BusinessOwner) {
    this.items.push(businessOwner);

    DomainEvents.dispatchEventsForAggregate(businessOwner.id);
  }

  async save(businessOwner: BusinessOwner) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === businessOwner.id
    );

    this.items[itemIndex] = businessOwner;

    DomainEvents.dispatchEventsForAggregate(businessOwner.id);
  }

  async delete(businessOwner: BusinessOwner) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === businessOwner.id
    );

    this.items.splice(itemIndex, 1);
  }
}
