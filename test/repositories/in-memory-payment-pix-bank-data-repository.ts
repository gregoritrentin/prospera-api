// import { DomainEvents } from "@/core/events/domain-events";
// import { PaginationParams } from "@/core/repositories/pagination-params";
// import { PaymentRepository } from "@/domain/payment/repositories/payment-repository";
// import { Payment } from "@/domain/payment/entities/payment";
// import { PaymentDetails } from "@/domain/payment/entities/value-objects/payment-details";

// export class InMemoryPaymentsRepository implements PaymentRepository {
//   public items: Payment[] = [];
//   payments: any;

//   constructor() {}
//   findByIdDetails(
//     _id: string,
//     _businessId: string
//   ): Promise<PaymentDetails | null> {
//     throw new Error("Method not implemented.");
//   }
//   findManyDetails(
//     _params: PaginationParams,
//     _businessId: string
//   ): Promise<PaymentDetails[]> {
//     throw new Error("Method not implemented.");
//   }

//   async findById(id: string) {
//     const payment = this.items.find((item) => item.id.toString() === id);

//     if (!payment) {
//       return null;
//     }

//     return payment;
//   }

//   async findMany({ page }: PaginationParams) {
//     const payments = this.items.slice((page - 1) * 20, page * 20);
//     return payments;
//   }

//   async create(payment: Payment) {
//     this.items.push(payment);

//     DomainEvents.dispatchEventsForAggregate(payment.id);
//   }

//   async save(payment: Payment) {
//     const itemIndex = this.items.findIndex((item) => item.id === payment.id);

//     this.items[itemIndex] = payment;

//     DomainEvents.dispatchEventsForAggregate(payment.id);
//   }
// }
