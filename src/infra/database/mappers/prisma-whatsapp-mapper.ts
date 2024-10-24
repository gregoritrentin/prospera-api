import { WhatsApp as PrismaWhatsApp, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/whatsApp/entities/whatsapp'

export class PrismaWhatsAppMapper {
    static toDomain(raw: PrismaWhatsApp): WhatsApp {
        return WhatsApp.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                to: raw.to,
                content: raw.content,
                status: raw.status,

            },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(whatsApp: WhatsApp): Prisma.WhatsAppUncheckedCreateInput {
        return {
            id: whatsApp.id.toString(),
            businessId: whatsApp.businessId?.toString() || '',
            to: whatsApp.to,
            content: whatsApp.content,
            status: whatsApp.status,

        }
    }
}