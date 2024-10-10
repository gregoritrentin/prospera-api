import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FileRepository } from '@/domain/file/repository/file-repository'
import { File } from '@/domain/file/entities/file'
import { PrismaFileMapper } from '@/infra/database/mappers/prisma-file-mapper'

@Injectable()
export class PrismaFilesRepository implements FileRepository {
    constructor(private prisma: PrismaService) { }

    async create(file: File): Promise<void> {
        const data = PrismaFileMapper.toPrisma(file)

        await this.prisma.file.create({
            data,
        })
    }
}
