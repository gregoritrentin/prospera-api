import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { App, AppProps } from "@/domain/application/entities/app";

export function makeApp(
  override: Partial<AppProps> = {},
  id?: UniqueEntityID
): App {
  const app = App.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ min: 0 }),
      quantity: faker.number.int({ min: 0 }),
      type: faker.commerce.productAdjective(),
      status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
      ...override,
    },
    id
  );

  return app;
}
