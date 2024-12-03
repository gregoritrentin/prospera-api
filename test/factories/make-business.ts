import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Business,
  BusinessProps,
} from "@/domain/application/entities/business";
import { faker } from "@faker-js/faker";

export function makeBusiness(
  override: Partial<BusinessProps> = {},
  id?: UniqueEntityID
): Business {
  const defaultProps: BusinessProps = {
    marketplaceId: new UniqueEntityID(faker.string.uuid()),
    name: faker.company.name(),
    document: faker.string.numeric(14),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    ie: faker.string.numeric(9),
    im: faker.string.numeric(9),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    neighborhood: faker.location.county(),
    postalCode: faker.location.zipCode(),
    countryCode: "BR",
    stateCode: faker.location.state({ abbreviated: true }),
    cityCode: faker.string.numeric(7),
    businessSize: faker.helpers.arrayElement(["SMALL", "MEDIUM", "LARGE"]),
    businessType: faker.helpers.arrayElement(["334r", "WHOLESALE", "SERVICE"]),
    foundingDate: faker.date.past(),
    status: faker.helpers.arrayElement(["ACTIVE", "INACTIVE"]),
    createdAt: new Date(),
  };

  return Business.create(
    {
      ...defaultProps,
      ...override,
    },
    id
  );
}
