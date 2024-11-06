import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { App, AppProps } from "@/domain/application/entities/app";

export function makeApp(override: Partial<AppProps> = {}, id?: UniqueEntityID) {
  const app = App.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return app;
}
