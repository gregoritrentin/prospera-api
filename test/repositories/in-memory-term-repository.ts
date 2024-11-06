import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { TermRepository } from "@/domain/application/repositories/term-repository";
import { Term } from "@/domain/application/entities/term";
import { NotImplementedException } from "@nestjs/common";

export class InMemorytermRepository implements TermRepository {
  public items: Term[] = [];

  constructor() {}
    findLatest(): Promise<Term | null> {
        throw new Error("Method not implemented.");
    }

  async findById(id: string): Promise<Term | null> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async findMany(params: PaginationParams): Promise<Term[]> {
    throw new NotImplementedException("Method setLogo not implemented");
  }

  async create(term: Term) {
    this.items.push(term);

    DomainEvents.dispatchEventsForAggregate(term.id);
  }

  async save(term: Term) {
    const itemIndex = this.items.findIndex((item) => item.id === term.id);

    this.items[itemIndex] = term;

    DomainEvents.dispatchEventsForAggregate(term.id);
  }

  async delete(term: Term) {
    const itemIndex = this.items.findIndex((item) => item.id === term.id);

    this.items.splice(itemIndex, 1);
  }
}
