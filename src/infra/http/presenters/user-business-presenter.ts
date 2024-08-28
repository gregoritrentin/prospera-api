import { UserBusiness } from "@/domain/core/entities/user-business";

export class UserBusinessPresenter {
    static toHttp(userBusiness: UserBusiness) {
        return {
            businessId: userBusiness.businessId.toString(),
            userId: userBusiness.userId.toString(),
            status: userBusiness.status,
            createdAt: userBusiness.createdAt,
            updatedAt: userBusiness.updatedAt
        }
    }
}