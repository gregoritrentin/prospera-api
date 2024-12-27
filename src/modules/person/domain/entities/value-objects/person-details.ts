import { ValueObject } from @core/co@core/entiti@core/value-object'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'

export interface PersonDetailsProps {
    businessId: UniqueEntityID
    businessName: string
    personId: UniqueEntityID
    personName: string
    document: string
    phone: string
    email: string
    addressLine1: string
    addressLine2: string
    addressLine3?: string | null
    neighborhood: string
    postalCode: string
    countryCode: string
    stateCode: string
    cityCode: string
    status: string
    notes?: string | null
    createdAt: Date
    updatedAt?: Date | null
}

export class PersonDetails extends ValueObject<PersonDetailsProps> {

    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }
    get personId() {
        return this.props.personId
    }

    get personName() {
        return this.props.personName
    }

    get document() {
        return this.props.document
    }

    get email() {
        return this.props.email
    }

    get phone() {
        return this.props.phone
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

    get status() {
        return this.props.status
    }

    get notes() {
        return this.props.notes
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: PersonDetailsProps) {
        return new PersonDetails(props)
    }
}