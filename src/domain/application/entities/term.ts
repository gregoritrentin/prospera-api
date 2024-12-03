import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface TermProps {
  title: string;
  content: string;
  language: string;
  startAt: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Term extends AggregateRoot<TermProps> {
  termId: string | undefined;
  static termId: any;

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get language() {
    return this.props.language;
  }

  get startAt() {
    return this.props.startAt;
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

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set language(language: string) {
    this.props.language = language;
    this.touch();
  }

  set startAt(startAt: Date) {
    this.props.startAt = startAt;
    this.touch();
  }

  static create(props: Optional<TermProps, "createdAt">, id?: UniqueEntityID) {
    const term = new Term(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return term;
  }
}
