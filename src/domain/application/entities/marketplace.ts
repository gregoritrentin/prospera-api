import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MarketplaceProps {
  name: string;
  document: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Marketplace extends AggregateRoot<MarketplaceProps> {
  marketplaceId: any;

  get name() {
    return this.props.name;
  }

  get document() {
    return this.props.document;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set status(status: string) {
    this.props.status = status;
    this.touch();
  }

  static create(
    props: Optional<MarketplaceProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const marketplace = new Marketplace(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return marketplace;
  }
}
