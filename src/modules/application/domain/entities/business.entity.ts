import { AggregateRoot } from '@/core/domain/entity/aggregate-root'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Optional } from '@/core/utils/optional'

export interface BusinessProps {

  marketplaceId: UniqueEntityID
  name: string
  email: string
  phone: string
  document: string
  ie?: string | null
  im?: string | null
  addressLine1: string
  addressLine2: string
  addressLine3?: string | null | undefined
  neighborhood: string
  postalCode: string
  countryCode: string
  stateCode: string
  cityCode: string
  status: string
  logoFileId?: string | null
  digitalCertificateFileId?: string | null
  businessSize: string
  businessType: string
  foundingDate: Date
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

  get ie() {
    return this.props.ie
  }

  get im() {
    return this.props.im
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

  get logoFileId() {
    return this.props.logoFileId
  }

  get digitalCertificateFileId() {
    return this.props.digitalCertificateFileId
  }

  get businessSize() {
    return this.props.businessSize
  }

  get businessType() {
    return this.props.businessType
  }

  get foundingDate() {
    return this.props.foundingDate
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

  set ie(ie: string | undefined | null) {
    if (ie === undefined && ie === null) {
      return
    }
    this.props.addressLine3 = ie
    this.touch()
  }

  set im(im: string | undefined | null) {
    if (im === undefined && im === null) {
      return
    }
    this.props.addressLine3 = im
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

  set businessSize(businessSize: string) {
    this.props.businessSize = businessSize
    this.touch()
  }

  set businessType(businessType: string) {
    this.props.businessType = businessType
    this.touch()
  }

  set foundingDate(foundingDate: Date) {
    this.props.foundingDate = foundingDate
    this.touch()
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  set logoFileId(logoFileId: string | undefined | null) {
    if (logoFileId === undefined && logoFileId === null) {
      return
    }
    this.props.logoFileId = logoFileId
    this.touch()
  }

  set digitalCertificateFileId(digitalCertificateFileId: string | undefined | null) {
    if (digitalCertificateFileId === undefined && digitalCertificateFileId === null) {
      return
    }
    this.props.digitalCertificateFileId = digitalCertificateFileId
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