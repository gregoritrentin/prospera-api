import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PaymentRepository } from "@/domain/payment/repositories/payment-repository";
import { Payment } from "@/domain/payment/entities/payment";
import { PaymentDetails } from "@/domain/payment/entities/value-objects/payment-details";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";
import { PrismaPaymentDetailsMapper } from "@/infra/database/mappers/prisma-payment-details-mapper";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {

    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Payment | null> {
        const payment = await this.prisma.payment.findUnique({
            where: {
                id,
                businessId,
            },
        });

        if (!payment) {
            return null;
        }

        return PrismaPaymentMapper.toDomain(payment);
    }

    async findByIdDetails(id: string, businessId: string): Promise<PaymentDetails | null> {
        const payment = await this.prisma.payment.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                business: true,
                person: true,
            }
        });

        if (!payment) {
            return null;
        }

        return PrismaPaymentDetailsMapper.toDomain(payment);
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Payment[]> {
        const payments = await this.prisma.payment.findMany({
            where: {
                businessId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return payments.map(PrismaPaymentMapper.toDomain);
    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<PaymentDetails[]> {
        const Pixs = await this.prisma.payment.findMany({
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

        return Pixs.map(PrismaPaymentDetailsMapper.toDomain)
    }

    async create(Pix: Payment): Promise<void> {
        const data = PrismaPaymentMapper.toPrisma(Pix);

        await this.prisma.payment.create({
            data,
        });
    }

    async save(Pix: Payment): Promise<void> {

        const data = PrismaPaymentMapper.toPrisma(Pix);

        await this.prisma.payment.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

}