import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserBusinessProps {

  businessId: UniqueEntityID
  userId: UniqueEntityID
  role: string
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class UserBusiness extends AggregateRoot<UserBusinessProps> {

  get businessId() {
    return this.props.businessId
  }

  get userId() {
    return this.props.userId
  }

  get role() {
    return this.props.role
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

  set role(role: string) {
    this.props.role = role
    this.touch()
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<UserBusinessProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const userBusiness = new UserBusiness(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return userBusiness
  }

}
