import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AppRepository } from "@/domain/application/repositories/app-repository";
import { App } from "@/domain/application/entities/app";

export class InMemoryAppsRepository implements AppRepository {
  public items: App[] = [];

  constructor() {}
  async findById(id: string) {
    const app = this.items.find((item) => item.id.toString() === id);

    if (!app) {
      return null;
    }

    return app;
  }

  async findMany({ page }: PaginationParams) {
    const apps = this.items.slice((page - 1) * 20, page * 20);
    return apps;
  }

  async create(app: App) {
    this.items.push(app);

    DomainEvents.dispatchEventsForAggregate(app.id);
  }

  async save(app: App) {
    const itemIndex = this.items.findIndex((item) => item.id === app.id);

    this.items[itemIndex] = app;

    DomainEvents.dispatchEventsForAggregate(app.id);
  }

  async delete(app: App) {
    const itemIndex = this.items.findIndex((item) => item.id === app.id);

    this.items.splice(itemIndex, 1);
  }
}
