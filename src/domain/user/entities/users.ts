import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface UserProps {
    name: string
    email: string
    password: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
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

    set email(email: string) {
        this.props.email = email
        this.touch()
    }

    set password(password: string) {
        this.props.password = password
        this.touch()
    }
    set status(status: string) {
        this.props.status = status
        this.touch()
    }


    static create(
        props: Optional<UserProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const user = new User(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return user
    }

}
