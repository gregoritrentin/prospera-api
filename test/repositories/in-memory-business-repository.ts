import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { BusinessRepository } from "@/domain/application/repositories/business-repository";
import { Business } from "@/domain/application/entities/business";
import { NotImplementedException } from "@nestjs/common";

export class InMemoryBusinessRepository implements BusinessRepository {
  public items: Business[] = [];

  constructor() {}

  async findByDocument(document: string): Promise<Business | null> {
    const business = this.items.find((item) => item.document === document);
    return business || null;
  }

  async setLogo(_businessId: string, _logoFileId: string) {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async findMe(_id: string): Promise<Business[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async findById(id: string): Promise<Business | null> {
    const business = this.items.find((item) => item.businessId === id);

    if (!business) {
      return null;
    }

    return business;
  }

  async findMany(_params: PaginationParams): Promise<Business[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(business: Business) {
    this.items.push(business);

    DomainEvents.dispatchEventsForAggregate(business.id);
  }

  async save(business: Business) {
    const itemIndex = this.items.findIndex((item) => item.id === business.id);

    this.items[itemIndex] = business;

    DomainEvents.dispatchEventsForAggregate(business.id);
  }

  async delete(business: Business) {
    const itemIndex = this.items.findIndex((item) => item.id === business.id);

    this.items.splice(itemIndex, 1);
  }
}
