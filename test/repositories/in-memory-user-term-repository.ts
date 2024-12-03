import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { UserTermRepository } from "@/domain/application/repositories/user-term-repository";
import { UserTerm } from "@/domain/application/entities/user-term";
import { NotImplementedException } from "@nestjs/common";

export class InMemoryUserTermRepository implements UserTermRepository {
  public items: UserTerm[] = [];

  constructor() {}
  findByUser(_userId: string): Promise<UserTerm[] | null> {
    throw new Error("Method not implemented.");
  }
  findByTermAndUser(
    _termId: string,
    _userId: string
  ): Promise<UserTerm | null> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<UserTerm | null> {
    const userTerm = this.items.find(
      (item) => item.userTermId.toString() === id
    );

    if (!userTerm) {
      return null;
    }

    return userTerm;
  }

  async findMany(_params: PaginationParams): Promise<UserTerm[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(userTerm: UserTerm) {
    this.items.push(userTerm);

    DomainEvents.dispatchEventsForAggregate(userTerm.id);
  }

  async delete(userTerm: UserTerm) {
    const itemIndex = this.items.findIndex((item) => item.id === userTerm.id);

    this.items.splice(itemIndex, 1);
  }
}
