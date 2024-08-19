import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ItemTaxation } from '@/domain/item/entities/item-taxation'
import { ItemTaxation as PrismaItemTaxation, Prisma } from '@prisma/client'

export class PrismaItemTaxationMapper {
    static toDomain(raw: PrismaItemTaxation): ItemTaxation {
        return ItemTaxation.create({
            businessId: new UniqueEntityID(raw.businessId),
            taxation: raw.taxation,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )

    }

    static toPrisma(itemTaxation: ItemTaxation): Prisma.ItemTaxationUncheckedCreateInput {
        return {
            id: itemTaxation.id.toString(),
            businessId: itemTaxation.businessId.toString(),
            taxation: itemTaxation.taxation,
            status: itemTaxation.status,
            createdAt: itemTaxation.createdAt,
            updateAt: itemTaxation.updatedAt,

        }
    }
}