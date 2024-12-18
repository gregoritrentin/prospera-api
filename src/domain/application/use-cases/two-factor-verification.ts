import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TwoFactorType } from '@/core/types/enums'

export interface TwoFactorVerificationProps {
    userId: UniqueEntityID
    type: TwoFactorType
    code: string
    expiresAt: Date
    attempts: number
    verified: boolean
    createdAt: Date
    updatedAt?: Date
}

export class TwoFactorVerification extends Entity<TwoFactorVerificationProps> {
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
        props: Optional<TwoFactorVerificationProps, 'createdAt' | 'attempts' | 'verified'>,
        id?: UniqueEntityID,
    ) {
        return new TwoFactorVerification(
            {
                ...props,
                attempts: props.attempts ?? 0,
                verified: props.verified ?? false,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
    }
}