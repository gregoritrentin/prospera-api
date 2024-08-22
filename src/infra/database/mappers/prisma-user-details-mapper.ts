import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserDetails } from '@/domain/user/entities/value-objects/user-details'
import { User as PrismaUser, File as PrismaFile } from '@prisma/client'

type PrismaUserDetails = PrismaUser & {
    file: PrismaFile
}

export class PrismaUserDetailsMapper {
    static toDomain(raw: PrismaUserDetails): UserDetails {

        return UserDetails.create({

            id: new UniqueEntityID(raw.id),
            name: raw.name,
            email: raw.email,
            status: raw.status,
            defaultBusiness: raw.defaultBusiness,
            photoFileUrl: raw.file.url,
            photoFileId: raw.photoFileId,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,

        },

        )
    }
}
