import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { MarketplaceRepository } from "@/domain/application/repositories/marketplace-repository";
import { Marketplace } from "@/domain/application/entities/marketplace";
import { NotImplementedException } from "@nestjs/common";

export class InMemorymarketplaceRepository implements MarketplaceRepository {
  public items: Marketplace[] = [];

  constructor() {}

  async findById(id: string): Promise<Marketplace | null> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async findMany(params: PaginationParams): Promise<Marketplace[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(marketplace: Marketplace) {
    this.items.push(marketplace);

    DomainEvents.dispatchEventsForAggregate(marketplace.id);
  }

  async save(marketplace: Marketplace) {
    const itemIndex = this.items.findIndex((item) => item.id === marketplace.id);

    this.items[itemIndex] = marketplace;

    DomainEvents.dispatchEventsForAggregate(marketplace.id);
  }

  async delete(marketplace: Marketplace) {
    const itemIndex = this.items.findIndex((item) => item.id === marketplace.id);

    this.items.splice(itemIndex, 1);
  }
}
