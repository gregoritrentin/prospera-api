import { UserDetails } from "@/modules/application/domain/entities/value-objects/user-details"

export class UserDetailsPresenter {
    static toHttp(userDetails: UserDetails) {
        return {

            id: userDetails.id.toString(),
            name: userDetails.name,
            status: userDetails.status,
            photoFileUrl: userDetails.photoFileUrl,
            createdAt: userDetails.createdAt,
            updatedAt: userDetails.updatedAt
        }
    }
}