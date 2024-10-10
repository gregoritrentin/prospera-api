//import { UserBusiness } from "@/domain/user/entities/user-business";
import { UserBusinessDetails } from "@/domain/application/entities/value-objects/user-business-details";

export class UserBusinessDetailsPresenter {
    static toHttp(userBusinessDetails: UserBusinessDetails) {
        return {

            businessId: userBusinessDetails.businessId.toString(),
            businessName: userBusinessDetails.businessName,
            personId: userBusinessDetails.userId.toString(),
            personName: userBusinessDetails.userName,
            role: userBusinessDetails.role,
            status: userBusinessDetails.status,
            createdAt: userBusinessDetails.createdAt,
            updatedAt: userBusinessDetails.updatedAt
        }
    }
}