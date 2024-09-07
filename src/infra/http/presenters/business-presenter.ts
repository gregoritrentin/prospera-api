import { Business } from "@/domain/core/entities/business";

export class BusinessPresenter {
    static toHttp(business: Business) {
        return {
            id: business.id.toString(),
            marketplaceId: business.marketplaceId.toString(),
            name: business.name,
            phone: business.phone,
            email: business.email,
            document: business.document,
            addressLine1: business.addressLine1,
            addressLine2: business.addressLine2,
            addressLine3: business.addressLine3,
            neighborhood: business.neighborhood,
            postalCode: business.postalCode,
            countryCode: business.countryCode,
            stateCode: business.stateCode,
            cityCode: business.cityCode,
            status: business.status,
            businessSize: business.businessSize,
            businessType: business.businessType,
            createdAt: business.createdAt,
            updatedAt: business.updatedAt
        }
    }
}