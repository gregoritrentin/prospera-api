import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PixRepository } from "@/domain/transaction/repositories/pix-repository";
import { Pix } from "@/domain/transaction/entities/pix";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaTransactionPixMapper } from "@/infra/database/mappers/prisma-transaction-pix-mapper";
import { PixDetails } from "@/domain/transaction/entities/value-objects/pix-details";
import { PrismaPixDetailsMapper } from "@/infra/database/mappers/prisma-transaction-pix-details-mapper";

@Injectable()
export class PrismaPixRepository implements PixRepository {

    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Pix | null> {
        const transactionPix = await this.prisma.transactionPix.findUnique({
            where: {
                id,
                businessId,
            },
        });

        if (!transactionPix) {
            return null;
        }

        return PrismaTransactionPixMapper.toDomain(transactionPix);
    }

    async findByIdDetails(id: string, businessId: string): Promise<PixDetails | null> {
        const transactionPix = await this.prisma.transactionPix.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                business: true,
                person: true,
            }
        });

        if (!transactionPix) {
            return null;
        }

        return PrismaPixDetailsMapper.toDomain(transactionPix);
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Pix[]> {
        const transactionPixs = await this.prisma.transactionPix.findMany({
            where: {
                businessId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return transactionPixs.map(PrismaTransactionPixMapper.toDomain);
    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<PixDetails[]> {
        const pixs = await this.prisma.transactionPix.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            include: {
                business: true,
                person: true,

            },
            skip: (page - 1) * 20,
        })

        return pixs.map(PrismaPixDetailsMapper.toDomain)
    }

    async create(pix: Pix): Promise<void> {
        const data = PrismaTransactionPixMapper.toPrisma(pix);

        await this.prisma.transactionPix.create({
            data,
        });
    }

    async save(pix: Pix): Promise<void> {

        const data = PrismaTransactionPixMapper.toPrisma(pix);

        await this.prisma.transactionPix.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

}