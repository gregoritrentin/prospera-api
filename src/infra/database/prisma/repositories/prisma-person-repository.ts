import { PaginationParams } from "@/core/repositories/pagination-params";
import { Person } from "@/domain/person/entities/person";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaPersonMapper } from "../../mappers/prisma-person-mapper";
import { PersonRepository } from "@/domain/person/repositories/person-repository";
import { PersonDetails } from "@/domain/person/entities/value-objects/person-details";
import { PrismaPersonDetailsMapper } from "@/infra/database/mappers/prisma-person-details-mapper";

@Injectable()
export class PrismaPersonRepository implements PersonRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Person | null> {
        const person = await this.prisma.person.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!person) {
            return null
        }
        return PrismaPersonMapper.toDomain(person)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Person[]> {

        const person = await this.prisma.person.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,

            where: {
                businessId,
            },
            include: {
                business: true

            },
            skip: (page - 1) * 20,
        })

        return person.map(PrismaPersonMapper.toDomain)

    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<PersonDetails[]> {

        const person = await this.prisma.person.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,

            where: {
                businessId,
            },
            include: {
                business: true
            },

            skip: (page - 1) * 20,
        })

        return person.map(PrismaPersonDetailsMapper.toDomain)

    }

    async save(person: Person): Promise<void> {
        const data = PrismaPersonMapper.toPrisma(person)

        await this.prisma.person.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(person: Person): Promise<void> {
        const data = PrismaPersonMapper.toPrisma(person)

        await this.prisma.person.create({
            data,
        })
    }

    async delete(person: Person): Promise<void> {
        const data = PrismaPersonMapper.toPrisma(person)
        await this.prisma.person.delete({
            where: {
                id: data.id,
            }
        })
    }
}