import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

export interface BusinessProps {
  marketplaceId: UniqueEntityID
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
  state: string
  city: string
  status: string
  businessSize: string
  businessType: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Business extends AggregateRoot<BusinessProps> {
  get marketplaceId() {
    return this.props.marketplaceId
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

  get state() {
    return this.props.state
  }

  get city() {
    return this.props.city
  }

  get status() {
    return this.props.status
  }

  get businessSize() {
    return this.props.businessSize
  }

  get businessType() {
    return this.props.businessType
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set marketplaceId(marketplaceId: UniqueEntityID) {
    this.props.marketplaceId = marketplaceId
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

  set state(state: string) {
    this.props.state = state
    this.touch()
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  set businessSize(businessSize: string) {
    this.props.businessSize = businessSize
    this.touch()
  }

  set businessType(businessType: string) {
    this.props.businessType = businessType
    this.touch()
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<BusinessProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const business = new Business(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),

      },
      id,
    )

    return business
  }
}
