import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { WhatsAppRepository } from '@/domain/whatsapp/repositories/whatsapp-repository'
import { WhatsApp } from '@/domain/whatsapp/entities/whatsapp'
import { PaginationParams } from '@core/domain/repository/pagination-params'
import { PrismaWhatsAppMapper } from '@/infra/database/mappers/prisma-whatsapp-mapper'


@Injectable()
export class PrismaWhatsAppRepository implements WhatsAppRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<WhatsApp | null> {
        const whatsapp = await this.prisma.whatsApp.findUnique({
            where: {
                id,
            }
        })

        if (!whatsapp) {
            return null
        }
        return PrismaWhatsAppMapper.toDomain(whatsapp)
    }

    async findMany({ page }: PaginationParams): Promise<WhatsApp[]> {

        const whatsapp = await this.prisma.whatsApp.findMany({
            orderBy: {
                createdAt: 'asc',
            },

            take: 20,

            skip: (page - 1) * 20,

        })

        return whatsapp.map(PrismaWhatsAppMapper.toDomain)

    }

    async create(whatsapp: WhatsApp): Promise<void> {
        const data = PrismaWhatsAppMapper.toPrisma(whatsapp)

        await this.prisma.whatsApp.create({
            data,
        })
    }

    async save(whatsapp: WhatsApp): Promise<void> {
        const data = PrismaWhatsAppMapper.toPrisma(whatsapp)

        await this.prisma.whatsApp.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

}