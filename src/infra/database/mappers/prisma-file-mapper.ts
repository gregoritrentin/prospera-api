import { Prisma, File as PrismaFile } from '@prisma/client'
import { File } from '@/domain/file/entities/file'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaFileMapper {
    static toDomain(raw: PrismaFile): File {
        return File.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                title: raw.title,
                url: raw.url,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(
        file: File,
    ): Prisma.FileUncheckedCreateInput {
        return {
            businessId: file.businessId.toString(),
            id: file.id.toString(),
            title: file.title,
            url: file.url,
            createdAt: file.createdAt,
        }
    }
}
