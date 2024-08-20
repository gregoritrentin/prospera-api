import { User } from '@/domain/user/entities/users'

export class UserPresenter {
    static toHttp(user: User) {
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            status: user.status,
            defaultBusiness: user.defaultBusiness,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}