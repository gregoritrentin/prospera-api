import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { MarketplaceRepository } from "@/domain/application/repositories/marketplace-repository";
import { Marketplace } from "@/domain/application/entities/marketplace";
import { NotImplementedException } from "@nestjs/common";

export class InMemorymarketplaceRepository implements MarketplaceRepository {
  public items: Marketplace[] = [];

  constructor() {}

  async findById(id: string): Promise<Marketplace | null> {
    const marketplace = this.items.find((item) => item.marketplaceId === id);

    if (!marketplace) {
      return null;
    }

    return marketplace;
  }

  async findMany(params: PaginationParams): Promise<Marketplace[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(marketplace: Marketplace) {
    this.items.push(marketplace);

    if (marketplace.marketplaceId) {
      DomainEvents.dispatchEventsForAggregate(marketplace.marketplaceId);
    }
  }

  async save(marketplace: Marketplace) {
    const itemIndex = this.items.findIndex(
      (item) => item.marketplaceId === marketplace.marketplaceId
    );

    this.items[itemIndex] = marketplace;

    if (marketplace.marketplaceId) {
      DomainEvents.dispatchEventsForAggregate(marketplace.marketplaceId);
    }
  }

  async delete(marketplace: Marketplace): Promise<void> {
    this.items = this.items.filter(
      (item) => item.marketplaceId !== marketplace.marketplaceId
    );

    if (marketplace.marketplaceId) {
      DomainEvents.dispatchEventsForAggregate(marketplace.marketplaceId);
    }
  }
}
