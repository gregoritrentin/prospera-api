//import { UserBusiness } from "@/domain/user/entities/user-business";
import { UserDetails } from "@/domain/user/entities/value-objects/user-details";

export class UserDetailsPresenter {
    static toHttp(userDetails: UserDetails) {
        return {

            id: userDetails.id.toString(),
            name: userDetails.name,
            //role: userDetails.role,
            status: userDetails.status,
            photoFileUrl: userDetails.photoFileUrl,
            createdAt: userDetails.createdAt,
            updatedAt: userDetails.updatedAt
        }
    }
}