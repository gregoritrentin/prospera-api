import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { EmailRepository } from '@/modules/email/domain/repositories/email-repository'
import { Email } from '@/modules/email/domain/entities/email'
import { PrismaEmailMapper } from 'prisma-email-mapper.mapper'

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