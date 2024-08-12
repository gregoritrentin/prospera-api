import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

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
  state: string
  city: string
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

  get state() {
    return this.props.state
  }

  get city() {
    return this.props.city
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

  // set addressLine3(addressLine3: string) {
  //   this.props.addressLine3 = addressLine3
  //   this.touch()
  // }

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

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  // set notes(notes: string) {
  //   this.props.notes = notes
  //   this.touch()
  // }

  static create(
    props: Optional<PersonProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const person = new Person(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        addressLine3: props.addressLine3 ?? null,
        notes: props.notes ?? null
      },
      id,
    )

    return person
  }

}
