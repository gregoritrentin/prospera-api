import { AggregateRoot } from '@core/domain/entity/aggregate-root'
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Optional } from '@core/utils/optional'

export interface UserTermProps {

    termId: UniqueEntityID
    userId: UniqueEntityID
    ip: string
    createdAt: Date
    updatedAt?: Date | null
}

export class UserTerm extends AggregateRoot<UserTermProps> {

    get termId() {
        return this.props.termId
    }

    get userId() {
        return this.props.userId
    }

    get ip() {
        return this.props.ip
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

    set termId(termId: UniqueEntityID) {
        this.props.termId = termId
        this.touch()
    }

    set userId(userId: UniqueEntityID) {
        this.props.userId = userId
        this.touch()
    }

    set ip(ip: string) {
        this.props.ip = ip
        this.touch()
    }

    static create(
        props: Optional<UserTermProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const userTerm = new UserTerm(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return userTerm
    }

}
