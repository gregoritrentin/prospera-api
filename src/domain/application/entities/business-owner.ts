 import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface BusinessOwnerProps {
    businessId: UniqueEntityID
    name: string
    email: string
    phone: string
    document: string
    addressLine1: string
    addressLine2: string
    addressLine3?: string | null | undefined
    neighborhood: string
    postalCode: string
    countryCode: string
    stateCode: string
    cityCode: string
    birthDate: Date
    status: string
    ownerType: string
    createdAt: Date
    updatedAt?: Date | null
}

export class BusinessOwner extends AggregateRoot<BusinessOwnerProps> {
    get businessId() {
        return this.props.businessId
    }

    get name() {
        return this.props.name
    }

    get phone() {
        return this.props.phone
    }

    get email() {
        return this.props.email
    }

    get document() {
        return this.props.document
    }

    get addressLine1() {
        return this.props.addressLine1
    }

    get addressLine2() {
        return this.props.addressLine2
    }

    get addressLine3() {
        return this.props.addressLine3
    }

    get neighborhood() {
        return this.props.neighborhood
    }

    get postalCode() {
        return this.props.postalCode
    }

    get countryCode() {
        return this.props.countryCode
    }

    get stateCode() {
        return this.props.stateCode
    }

    get cityCode() {
        return this.props.cityCode
    }

    get birthDate() {
        return this.props.birthDate
    }

    get status() {
        return this.props.status
    }

    get ownerType() {
        return this.props.ownerType
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

    set businessId(businessId: UniqueEntityID) {
        this.props.businessId = businessId
        this.touch()
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

    set document(document: string) {
        this.props.document = document
        this.touch()
    }

    set addressLine1(addressLine1: string) {
        this.props.addressLine1 = addressLine1
        this.touch()
    }

    set addressLine2(addressLine2: string) {
        this.props.addressLine2 = addressLine2
        this.touch()
    }

    set addressLine3(addressLine3: string | undefined | null) {
        if (addressLine3 === undefined && addressLine3 === null) {
            return
        }
        this.props.addressLine3 = addressLine3
        this.touch()
    }

    set neighborhood(neighborhood: string) {
        this.props.neighborhood = neighborhood
        this.touch()
    }

    set postalCode(postalCode: string) {
        this.props.postalCode = postalCode
        this.touch()
    }

    set countryCode(countryCode: string) {
        this.props.countryCode = countryCode
        this.touch()
    }

    set stateCode(stateCode: string) {
        this.props.stateCode = stateCode
        this.touch()
    }

    set cityCode(cityCode: string) {
        this.props.cityCode = cityCode
        this.touch()
    }

    set birthDate(birthDate: Date) {
        this.props.birthDate = birthDate
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    set ownerType(ownerType: string) {
        this.props.ownerType = ownerType
        this.touch()
    }

    static create(
        props: Optional<BusinessOwnerProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const businessOwner = new BusinessOwner(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return businessOwner
    }
}
