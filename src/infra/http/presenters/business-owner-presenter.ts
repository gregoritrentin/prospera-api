import { BusinessOwner } from "@/domain/core/entities/business-owner";

export class BusinessOwnerPresenter {
    static toHttp(businessOwner: BusinessOwner) {
        return {
            id: businessOwner.id.toString(),
            businessId: businessOwner.businessId.toString(),
            name: businessOwner.name,
            phone: businessOwner.phone,
            email: businessOwner.email,
            document: businessOwner.document,
            addressLine1: businessOwner.addressLine1,
            addressLine2: businessOwner.addressLine2,
            addressLine3: businessOwner.addressLine3,
            neighborhood: businessOwner.neighborhood,
            postalCode: businessOwner.postalCode,
            countryCode: businessOwner.countryCode,
            state: businessOwner.state,
            city: businessOwner.city,
            status: businessOwner.status,
            ownerType: businessOwner.ownerType,
            createdAt: businessOwner.createdAt,
            updatedAt: businessOwner.updatedAt
        }
    }
}