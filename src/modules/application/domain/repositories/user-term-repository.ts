import { UserTerm } from '@/domain/application/entities/user-term'

export abstract class UserTermRepository {
    abstract findById(id: string): Promise<UserTerm | null>
    abstract findByUser(userId: string): Promise<UserTerm[] | null>
    abstract findByTermAndUser(termId: string, userId: string): Promise<UserTerm | null>
    abstract create(userTerm: UserTerm): Promise<void>
    abstract delete(userTerm: UserTerm): Promise<void>
}
