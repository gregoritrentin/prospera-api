import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FileRepository } from '@/modules/file/domain/repository/file-repository'
import { File } from '@/modules/file/domain/entities/file'
import { PrismaFileMapper } from 'prisma-file-mapper.mapper'

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