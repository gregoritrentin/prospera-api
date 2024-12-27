import { Entity } from '@core/domain/entity/entity'
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Optional } from '@core/utils/optional'
import { TwoFactorType } from '@core/utils/enums'

export interface TwoFactorAutenticationProps {
    userId: UniqueEntityID
    type: TwoFactorType
    code: string
    expiresAt: Date
    attempts: number
    verified: boolean
    createdAt: Date
    updatedAt?: Date | null
}

export class TwoFactorAutentication extends Entity<TwoFactorAutenticationProps> {
    get userId() {
        return this.props.userId
    }

    get type() {
        return this.props.type
    }

    get code() {
        return this.props.code
    }

    get expiresAt() {
        return this.props.expiresAt
    }

    get attempts() {
        return this.props.attempts
    }

    get verified() {
        return this.props.verified
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

    incrementAttempts() {
        this.props.attempts++
        this.touch()
    }

    verify() {
        this.props.verified = true
        this.touch()
    }

    static create(
        props: Optional<TwoFactorAutenticationProps, 'createdAt' | 'attempts' | 'verified' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const twoFactorAutentication = new TwoFactorAutentication(
            {
                ...props,
                attempts: props.attempts ?? 0,
                verified: props.verified ?? false,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? null,
            },
            id,
        )

        return twoFactorAutentication
    }
}