import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AppProps {
    name: string
    description: string
    price: number
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class App extends AggregateRoot<AppProps> {

    get name() {
        return this.props.name
    }

    get description() {
        return this.props.description
    }

    get price() {
        return this.props.price
    }

    get status() {
        return this.props.status
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    set name(name: string) {
        this.props.name = name
        this.touch()
    }

    set description(description: string) {
        this.props.description = description
        this.touch()
    }

    set price(price: number) {
        this.props.price = price
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(
        props: Optional<AppProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const app = new App(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return app
    }
}
