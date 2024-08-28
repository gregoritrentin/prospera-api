import { BusinessApp } from "@/domain/core/entities/business-app";

export class BusinessAppPresenter {
    static toHttp(businessApp: BusinessApp) {
        return {
            id: businessApp.id.toString(),
            businessId: businessApp.businessId.toString(),
            appId: businessApp.appId.toString(),
            quantity: businessApp.quantity,
            price: businessApp.price,
            status: businessApp.status,
            createdAt: businessApp.createdAt,
            updatedAt: businessApp.updatedAt
        }
    }
}