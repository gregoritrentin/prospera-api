import dayjs from 'dayjs'

import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Optional } from @core/co@core/typ@core/optional'
export interface PersonProps {

  businessId: UniqueEntityID
  name: string
  email: string
  phone: string
  document: string
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

export class Person extends AggregateRoot<PersonProps> {
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

  get status() {
    return this.props.status
  }

  get notes() {
    return this.props.notes || null
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

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  set notes(notes: string | undefined | null) {
    if (notes === undefined && notes === null) {
      return
    }
    this.props.notes = notes
    this.touch()
  }

  static create(
    props: Optional<PersonProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const person = new Person(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return person
  }

}