import { App } from "@/domain/app/entities/app";

export class AppPresenter {
    static toHttp(app: App) {
        return {
            name: app.name,
            description: app.description,
            price: app.price,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
        }
    }
}