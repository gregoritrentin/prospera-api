import { Account } from "@/modules/account/domain/entities/account"

export class AccountPresenter {
    static toHttp(account: Account) {
        return {
            id: account.id.toString(),
            businessId: account.businessId.toString(),
            number: account.number,
            status: account.status,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        }
    }
}