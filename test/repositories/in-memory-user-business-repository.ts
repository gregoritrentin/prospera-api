import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { UserBusinessRepository } from "@/domain/application/repositories/user-business-repository";
import { UserBusiness } from "@/domain/application/entities/user-business";
import { NotImplementedException } from "@nestjs/common";
import { UserBusinessDetails } from "@/domain/application/entities/value-objects/user-business-details";

export class InMemoryuserBusinessRepository implements UserBusinessRepository {
  public items: UserBusiness[] = [];

  constructor() {}
    findByUserAndBusiness(_userId: string, _businessId: string): Promise<UserBusiness | null> {
        throw new Error("Method not implemented.");
    }
    findManyDetails(_userId: string, _businessId: string): Promise<UserBusinessDetails[]> {
        throw new Error("Method not implemented.");
    }

  async findById(_id: string): Promise<UserBusiness | null> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async findMany(_params: PaginationParams): Promise<UserBusiness[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(userBusiness: UserBusiness) {
    this.items.push(userBusiness);

    DomainEvents.dispatchEventsForAggregate(userBusiness.id);
  }

  async save(userBusiness: UserBusiness) {
    const itemIndex = this.items.findIndex((item) => item.id === userBusiness.id);

    this.items[itemIndex] = userBusiness;

    DomainEvents.dispatchEventsForAggregate(userBusiness.id);
  }

  async delete(userBusiness: UserBusiness) {
    const itemIndex = this.items.findIndex((item) => item.id === userBusiness.id);

    this.items.splice(itemIndex, 1);
  }
}
