import { Marketplace } from "@/domain/business/entities/marketplace";

export class MarketplacePresenter {
    static toHttp(marketplace: Marketplace) {
        return {
            name: marketplace.name,
            status: marketplace.status,
            createdAt: marketplace.createdAt,
            updatedAt: marketplace.updatedAt
        }
    }
}