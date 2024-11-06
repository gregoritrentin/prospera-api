// import { DomainEvents } from "@/core/events/domain-events";
// import { PaginationParams } from "@/core/repositories/pagination-params";
// import { UserRepository } from "@/domain/application/repositories/user-repository";
// import { User } from "@/domain/application/entities/user";
// import { NotImplementedException } from "@nestjs/common";
// import { UserDetails } from "@/domain/application/entities/value-objects/user-details";

// export class InMemoryUserRepository implements UserRepository {
//   public items: User[] = [];

//   constructor() {}
//   findByEmail(_email: string): Promise<User | null> {
//     throw new Error("Method not implemented.");
//   }
//   findMe(_id: string): Promise<UserDetails | null> {
//     throw new Error("Method not implemented.");
//   }
//   setPhoto(_userId: string, _photoFileId: string): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   setDefaultBusiness(_userId: string, _businessId: string): Promise<void> {
//     throw new Error("Method not implemented.");
//   }

//   async findById(_id: string): Promise<User | null> {
//     throw new NotImplementedException("Method setLogo not implemented");
//   }

//   async findMany(_params: PaginationParams): Promise<User[]> {
//     throw new NotImplementedException("Method setLogo not implemented");
//   }

//   async create(user: User) {
//     this.items.push(user);

//     DomainEvents.dispatchEventsForAggregate(user.id);
//   }

//   async save(user: User) {
//     const itemIndex = this.items.findIndex((item) => item.id === user.id);

//     this.items[itemIndex] = user;

//     DomainEvents.dispatchEventsForAggregate(user.id);
//   }

//   async delete(user: User) {
//     const itemIndex = this.items.findIndex((item) => item.id === user.id);

//     this.items.splice(itemIndex, 1);
//   }
// }
