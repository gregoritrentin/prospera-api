import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { EmailRepository } from '@/domain/email/repositories/email-repository'
import { Email } from '@/domain/email/entities/email'
import { PrismaEmailMapper } from '@/infra/database/mappers/prisma-email-mapper'

@Injectable()
export class PrismaEmailRepository implements EmailRepository {
    constructor(private prisma: PrismaService) { }

    async create(email: Email): Promise<void> {
        const data = PrismaEmailMapper.toPrisma(email)

        await this.prisma.email.create({
            data,
        })
    }

}