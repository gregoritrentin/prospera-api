import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@core/domain/repository/pagination-params';
import { Nfse } from '@/domain/dfe/nfse/entities/nfse';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { NfseDetails } from '@/domain/dfe/nfse/entities/value-objects/nfse-details';
import { PrismaNfseMapper } from '@/infra/database/mappers/prisma-nfse-mapper';
import { PrismaNfseDetailsMapper } from '@/infra/database/mappers/prisma-nfse-details-mapper';

@Injectable()
export class PrismaNfseRepository implements NfseRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Nfse | null> {
        const nfse = await this.prisma.nfse.findFirst({
            where: {
                id,
                businessId,
            },
            include: {
                nfseEvent: true
            }
        });

        if (!nfse) {
            return null;
        }

        return PrismaNfseMapper.toDomain(nfse as any);
    }

    async findByIdDetails(id: string, businessId: string): Promise<NfseDetails | null> {
        const nfse = await this.prisma.nfse.findFirst({
            where: {
                id,
                businessId,
            },
            include: {
                business: true,
                person: true,
                nfseEvent: true,
                incidenceCityCode: true,
                incidenceStateCode: true,
                serviceCityCode: true,
                serviceStateCode: true,
                pdfFile: true,
                xmlFile: true,
            }
        });

        if (!nfse) {
            return null;
        }

        return PrismaNfseDetailsMapper.toDomain(nfse as any);
    }

    async findByNfseNumber(nfseNumber: string, businessId: string): Promise<Nfse | null> {
        const nfse = await this.prisma.nfse.findFirst({
            where: {
                nfseNumber,
                businessId,
            },
            include: {
                nfseEvent: true
            }
        });

        if (!nfse) {
            return null;
        }

        return PrismaNfseMapper.toDomain(nfse as any);
    }

    async findByRpsNumber(rpsNumber: string, rpsSeries: string, businessId: string): Promise<Nfse | null> {
        const nfse = await this.prisma.nfse.findFirst({
            where: {
                rpsNumber,
                rpsSeries,
                businessId,
            },
            include: {
                nfseEvent: true
            }
        });

        if (!nfse) {
            return null;
        }

        return PrismaNfseMapper.toDomain(nfse as any);
    }

    async create(nfse: Nfse): Promise<void> {
        const data = PrismaNfseMapper.toPrisma(nfse) as any;

        await this.prisma.nfse.create({
            data
        });
    }

    async save(nfse: Nfse): Promise<void> {
        const data = PrismaNfseMapper.toPrisma(nfse) as any;

        await this.prisma.nfse.update({
            where: { id: data.id },
            data
        });
    }

    async delete(nfse: Nfse): Promise<void> {
        await this.prisma.nfse.delete({
            where: { id: nfse.id.toString() }
        });
    }

    async findMany(
        { page }: PaginationParams,
        businessId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<Nfse[]> {
        const nfses = await this.prisma.nfse.findMany({
            where: {
                businessId,
                ...(startDate && endDate ? {
                    issueDate: {
                        gte: startDate,
                        lte: endDate,
                    }
                } : {})
            },
            include: {
                nfseEvent: true
            },
            orderBy: {
                issueDate: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return nfses.map(nfse => PrismaNfseMapper.toDomain(nfse as any));
    }

    async findByPeriod(
        businessId: string,
        startDate: Date,
        endDate: Date,
        { page }: PaginationParams
    ): Promise<Nfse[]> {
        const nfses = await this.prisma.nfse.findMany({
            where: {
                businessId,
                issueDate: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                nfseEvent: true
            },
            orderBy: {
                issueDate: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return nfses.map(nfse => PrismaNfseMapper.toDomain(nfse as any));
    }

    async findByCityConfiguration(
        cityCode: string,
        { page }: PaginationParams
    ): Promise<Nfse[]> {
        const nfses = await this.prisma.nfse.findMany({
            where: {
                business: {
                    cityCode,
                }
            },
            include: {
                nfseEvent: true
            },
            orderBy: {
                issueDate: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return nfses.map(nfse => PrismaNfseMapper.toDomain(nfse as any));
    }
}