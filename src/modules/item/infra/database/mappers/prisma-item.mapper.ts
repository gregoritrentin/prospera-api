import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Item } from '@/modules/item/domain/entities/item'
import { Item as PrismaItem, Prisma } from '@prisma/client'

export class PrismaItemMapper {
    static toDomain(raw: PrismaItem): Item {
        return Item.create({
            businessId: new UniqueEntityID(raw.businessId),
            description: raw.description,
            price: raw.price,
            ncm: raw.ncm,
            groupId: raw.groupId ? new UniqueEntityID(raw.groupId) : undefined,
            taxationId: raw.taxationId ? new UniqueEntityID(raw.taxationId) : undefined,
            idAux: raw.idAux,
            itemType: raw.itemType,
            unit: raw.unit,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt

        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(item: Item): Prisma.ItemUncheckedCreateInput {
        return {
            id: item.id.toString(),
            businessId: item.businessId.toString(),
            description: item.description,
            price: item.price,
            ncm: item.ncm,
            groupId: item.groupId?.toString(),
            taxationId: item.taxationId?.toString(),
            idAux: item.idAux,
            itemType: item.itemType,
            unit: item.unit,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
    }
}