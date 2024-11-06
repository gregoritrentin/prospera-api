import { UpdatePaymentPixController } from "./../../../infra/http/controllers/payment/update-payments-pix.controller";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AppProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class App extends AggregateRoot<AppProps> {
  private constructor(props: AppProps, id?: UniqueEntityID) {
    super(props, id);
  }
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get quantity() {
    return this.props.quantity;
  }

  get type() {
    return this.props.type;
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

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  set price(price: number) {
    this.props.price = price;
    this.touch();
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
    this.touch();
  }

  set type(type: string) {
    this.props.type = type;
    this.touch();
  }

  set status(status: string) {
    this.props.status = status;
    this.touch();
  }

  public updateName(name: string) {
    this.props.name = name;
    this.touch();
  }
  static create(
    props: Optional<AppProps, "createdAt">,
    id?: UniqueEntityID
  ): App {
    const app = new App(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return app;
  }
}
