import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ItemGroup } from '@/domain/item/entities/item-group'
import { ItemGroup as PrismaItemGroup, Prisma } from '@prisma/client'

export class PrismaItemGroupMapper {
    static toDomain(raw: PrismaItemGroup): ItemGroup {
        return ItemGroup.create({
            businessId: new UniqueEntityID(raw.businessId),
            group: raw.group,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )

    }

    static toPrisma(itemGroup: ItemGroup): Prisma.ItemGroupUncheckedCreateInput {
        return {
            id: itemGroup.id.toString(),
            businessId: itemGroup.businessId.toString(),
            group: itemGroup.group,
            status: itemGroup.status,
            createdAt: itemGroup.createdAt,
            updateAt: itemGroup.updatedAt,

        }
    }
}