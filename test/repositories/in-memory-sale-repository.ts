import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { SalesRepository } from "@/domain/sale/repositories/sales-repository";
import { Sale } from "@/domain/sale/entities/sale";
import { SaleDetails } from "@/domain/sale/entities/value-objects/sale-details";

export class InMemorySalesRepository implements SalesRepository {
  public items: Sale[] = [];
  public itemsDetails: SaleDetails[] = [];

  constructor() {}

  async findById(id: string): Promise<Sale | null> {
    const sale = this.items.find((item) => item.saleId.toString() === id);

    if (!sale) {
      return null;
    }

    return sale;
  }

  async findMany({ page }: PaginationParams) {
    const sales = this.items.slice((page - 1) * 20, page * 20);
    return sales;
  }

  async findManyDetails({ page }: PaginationParams) {
    const sales = this.itemsDetails.slice((page - 1) * 20, page * 20);
    return sales;
  }

  async create(sale: Sale) {
    this.items.push(sale);

    DomainEvents.dispatchEventsForAggregate(sale.id);
  }

  async save(sale: Sale) {
    const itemIndex = this.items.findIndex((item) => item.id === sale.id);

    this.items[itemIndex] = sale;

    DomainEvents.dispatchEventsForAggregate(sale.id);
  }

  async delete(sale: Sale) {
    const itemIndex = this.items.findIndex((item) => item.id === sale.id);

    this.items.splice(itemIndex, 1);
  }
}
