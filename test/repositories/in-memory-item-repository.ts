import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { ItemRepository } from "@/domain/item/repositories/item-repository";
import { Item } from "@/domain/item/entities/item";
import { ItemDetails } from "@/domain/item/entities/value-objects/item-details";

export class InMemoryItemsRepository implements ItemRepository {
  public items: Item[] = [];
  public itemsDetails: ItemDetails[] = [];

  constructor() {}

  async findById(id: string, businessId: string): Promise<Item | null> {
    const item = this.items.find(
      (item) =>
        item.id.toString() === id && item.businessId.toString() === businessId
    );

    return item || null;
  }
  async findMany({ page }: PaginationParams) {
    const items = this.items.slice((page - 1) * 20, page * 20);
    return items;
  }

  async findManyDetails({ page }: PaginationParams) {
    const items = this.itemsDetails.slice((page - 1) * 20, page * 20);
    return items;
  }

  async create(item: Item) {
    this.items.push(item);

    DomainEvents.dispatchEventsForAggregate(item.id);
  }

  async save(item: Item) {
    const itemIndex = this.items.findIndex((item) => item.id === item.id);

    this.items[itemIndex] = item;

    DomainEvents.dispatchEventsForAggregate(item.id);
  }
  async delete(item: Item) {
    const itemIndex = this.items.findIndex(
      (existingItem) => existingItem.id.toString() === item.id.toString()
    );

    if (itemIndex !== -1) {
      this.items.splice(itemIndex, 1);
    }
  }
}
