import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { BoletoRepository } from "@/domain/transaction/repositories/boleto-repository";
import { Boleto } from "@/domain/transaction/entities/boleto";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaTransactionBoletoMapper } from "@/infra/database/mappers/prisma-transaction-boleto-mapper";
import { BoletoDetails } from "@/domain/transaction/entities/value-objects/boleto-details";
import { PrismaBoletoDetailsMapper } from "@/infra/database/mappers/prisma-transaction-boleto-details-mapper";

@Injectable()
export class PrismaBoletoRepository implements BoletoRepository {

    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Boleto | null> {
        const transactionBoleto = await this.prisma.transactionBoleto.findUnique({
            where: {
                id,
                businessId,
            },
        });

        if (!transactionBoleto) {
            return null;
        }

        return PrismaTransactionBoletoMapper.toDomain(transactionBoleto);
    }

    async findByIdDetails(id: string, businessId: string): Promise<BoletoDetails | null> {
        const transactionBoleto = await this.prisma.transactionBoleto.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                business: true,
                person: true,
                pdfFile: true
            }
        });

        if (!transactionBoleto) {
            return null;
        }

        return PrismaBoletoDetailsMapper.toDomain(transactionBoleto);
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Boleto[]> {
        const transactionBoletos = await this.prisma.transactionBoleto.findMany({
            where: {
                businessId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return transactionBoletos.map(PrismaTransactionBoletoMapper.toDomain);
    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<BoletoDetails[]> {
        const boletos = await this.prisma.transactionBoleto.findMany({
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
                pdfFile: true

            },
            skip: (page - 1) * 20,
        })

        return boletos.map(PrismaBoletoDetailsMapper.toDomain)
    }

    async create(boleto: Boleto): Promise<void> {
        const data = PrismaTransactionBoletoMapper.toPrisma(boleto);

        await this.prisma.transactionBoleto.create({
            data,
        });
    }

    async save(boleto: Boleto): Promise<void> {

        const data = PrismaTransactionBoletoMapper.toPrisma(boleto);

        await this.prisma.transactionBoleto.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

}