import { Marketplace } from "@/domain/core/entities/marketplace";

export class MarketplacePresenter {
    static toHttp(marketplace: Marketplace) {
        return {
            id: marketplace.id.toString(),
            name: marketplace.name,
            document: marketplace.document,
            status: marketplace.status,
            createdAt: marketplace.createdAt,
            updatedAt: marketplace.updatedAt
        }
    }
}