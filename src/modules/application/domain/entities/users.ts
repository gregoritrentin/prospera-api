import { Entity } from "@core/domain/entity/entity"
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Optional } from '@core/utils/optional'

interface UserProps {
    name: string
    email: string
    phone: string
    password: string
    status: string
    defaultBusiness?: string | null
    photoFileId?: string | null
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

    get phone() {
        return this.props.phone
    }

    get password() {
        return this.props.password
    }

    get defaultBusiness() {
        return this.props.defaultBusiness
    }

    get photoFileId() {
        return this.props.photoFileId
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

    set phone(phone: string) {
        this.props.phone = phone
        this.touch()
    }

    set password(password: string) {
        this.props.password = password
        this.touch()
    }

    set defaultBusiness(defaultBusiness: string | undefined | null) {
        if (defaultBusiness === undefined && defaultBusiness === null) {
            return
        }
        this.props.defaultBusiness = defaultBusiness
        this.touch()
    }

    set photoFileId(photoFileId: string | undefined | null) {
        if (photoFileId === undefined && photoFileId === null) {
            return
        }
        this.props.photoFileId = photoFileId
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
