import { App } from "@/domain/application/entities/app";

export class AppPresenter {
    static toHttp(app: App) {
        return {
            name: app.name,
            description: app.description,
            price: app.price,
            quantity: app.quantity,
            type: app.type,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
        }
    }
}