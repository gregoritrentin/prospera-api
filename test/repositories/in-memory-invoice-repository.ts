// import { DomainEvents } from "@/core/events/domain-events";
// import { PaginationParams } from "@/core/repositories/pagination-params";
// import { Invoice } from "@/domain/invoice/entities/invoice";
// import { InvoiceDetails } from "@/domain/invoice/entities/value-objects/invoice-details";
// import { InvoiceRepository } from "@/domain/invoice/respositories/invoice-repository";
// import { NotImplementedException } from "@nestjs/common";

// export class InMemoryInvoiceRepository implements InvoiceRepository {
//   public items: Invoice[] = [];

//   constructor() {}
//   findByIdDetails(
//     id: string,
//     businessId: string
//   ): Promise<InvoiceDetails | null> {
//     throw new Error("Method not implemented.");
//   }
//   findManyDetails(
//     params: PaginationParams,
//     businessId: string
//   ): Promise<InvoiceDetails[]> {
//     throw new Error("Method not implemented.");
//   }
//   save(payment: Invoice): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   findByUser(_userId: string): Promise<Invoice[] | null> {
//     throw new Error("Method not implemented.");
//   }
//   findByInvoiceAndUser(
//     _invoiceId: string,
//     _userId: string
//   ): Promise<Invoice | null> {
//     throw new Error("Method not implemented.");
//   }

//   async findById(_id: string): Promise<Invoice | null> {
//     throw new NotImplementedException("Method setLogo not implemented");
//   }

//   async findMany(_params: PaginationParams): Promise<Invoice[]> {
//     throw new NotImplementedException("Method setLogo not implemented");
//   }

//   async create(userInvoice: Invoice) {
//     this.items.push(userInvoice);

//     DomainEvents.dispatchEventsForAggregate(userInvoice.id);
//   }

//   async delete(userInvoice: Invoice) {
//     const itemIndex = this.items.findIndex(
//       (item) => item.id === userInvoice.id
//     );

//     this.items.splice(itemIndex, 1);
//   }
// }
