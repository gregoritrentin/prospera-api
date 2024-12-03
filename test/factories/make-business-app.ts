import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  BusinessApp,
  BusinessAppProps,
} from "@/domain/application/entities/business-app";

export function makeBusinessApp(
  override: Partial<BusinessAppProps> = {},
  id?: UniqueEntityID
): BusinessApp {
  const businessApp = BusinessApp.create(
    {
      businessId: new UniqueEntityID(),
      appId: new UniqueEntityID(),
      price: faker.number.float({ min: 0 }),
      quantity: faker.number.int({ min: 0 }),
      status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
      createdAt: faker.date.recent(),
      updatedAt: null,
      ...override,
    },
    id
  );

  return businessApp;
}
