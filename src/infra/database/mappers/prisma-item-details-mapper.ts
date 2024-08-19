import { Item as PrismaItem, Business as PrismaBusiness } from '@prisma/client'
import { ItemDetails } from '@/domain/item/entities/value-objects/item-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaItemBusiness = PrismaItem & {
    business: PrismaBusiness
}

export class PrismaItemDetailsMapper {
    static toDomain(raw: PrismaItemBusiness): ItemDetails {
        return ItemDetails.create({

            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,
            itemId: new UniqueEntityID(raw.id),
            description: raw.description,
            price: raw.price,
            ncm: raw.ncm,
            groupId: raw.groupId,
            taxationId: raw.taxationId,
            idAux: raw.idAux,
            itemType: raw.itemType,
            unit: raw.unit,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        })
    }
}