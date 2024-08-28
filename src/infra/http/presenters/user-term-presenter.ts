import { UserTerm } from "@/domain/core/entities/user-term";

export class UserTermPresenter {
    static toHttp(userTerm: UserTerm) {
        return {
            termId: userTerm.termId.toString(),
            userId: userTerm.userId.toString(),
            createdAt: userTerm.createdAt,
            updatedAt: userTerm.updatedAt
        }
    }
}