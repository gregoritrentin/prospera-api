import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { User } from '@/domain/user/entities/users'
import { PrismaUserMapper } from '@/infra/database/mappers/prisma-user-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserDetails } from '@/domain/user/entities/value-objects/user-details'
import { PrismaUserDetailsMapper } from '../../mappers/prisma-user-details-mapper'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    })

    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findMe(id: string): Promise<UserDetails | null> {

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        File: true,
      },

    })

    if (!user) {
      return null
    }

    return PrismaUserDetailsMapper.toDomain(user)

  }

  async findMany({ page }: PaginationParams): Promise<User[]> {

    const user = await this.prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },

      take: 20,

      skip: (page - 1) * 20,

    })

    return user.map(PrismaUserMapper.toDomain)

  }


  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.delete({
      where: {
        id: data.id,
      }
    })
  }

  async setphoto(userId: string, photoFileId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        photoFileId: photoFileId
      }

    })
  }

}