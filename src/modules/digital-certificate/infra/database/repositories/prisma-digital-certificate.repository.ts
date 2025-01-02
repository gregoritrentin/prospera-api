import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DigitalCertificateRepository } from '@/modules/digital-certificate/domain/repositories/digital-certificate-repository'
import { DigitalCertificate } from '@/modules/digital-certificate/domain/entities/digital-certificate'
import { PaginationParams } from '@/core/domain/repository/pagination-params'
import { PrismaDigitalCertificateMapper } from 'prisma-digital-certificate-mapper.mapper'
import { CertificateStatus } from '@prisma/client'

@Injectable()
export class PrismaDigitalCertificateRepository implements DigitalCertificateRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<DigitalCertificate | null> {
        const certificate = await this.prisma.digitalCertificate.findFirst({
            where: {
                id,
                businessId: businessId,
            },
            include: {
                certificateFile: true,
                business: true,
            },
        })

        if (!certificate) {
            return null
        }

        return PrismaDigitalCertificateMapper.toDomain(certificate)
    }

    async findUniqueActive(businessId: string): Promise<DigitalCertificate | null> {
        const certificate = await this.prisma.digitalCertificate.findFirst({
            where: {
                businessId: businessId,
                status: CertificateStatus.ACTIVE,
            },
            include: {
                certificateFile: true,
                business: true,
            },
        })

        if (!certificate) {
            return null
        }

        return PrismaDigitalCertificateMapper.toDomain(certificate)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<DigitalCertificate[]> {
        const certificates = await this.prisma.digitalCertificate.findMany({
            where: {
                businessId: businessId,
            },
            include: {
                certificateFile: true,
                business: true,
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                createdAt: 'desc',
            },
        })

        return certificates.map(PrismaDigitalCertificateMapper.toDomain)
    }

    async findExpiring(
        { page }: PaginationParams,
        businessId: string | '*',
        daysToExpire: number,
    ): Promise<DigitalCertificate[]> {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + daysToExpire)

        const certificates = await this.prisma.digitalCertificate.findMany({
            where: {
                ...(businessId !== '*' ? { business_id: businessId } : {}),
                expirationDate: {
                    lte: expirationDate,
                    gt: new Date(),
                },
            },
            include: {
                certificateFile: true,
                business: true,
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                expirationDate: 'asc',
            },
        })

        return certificates.map(PrismaDigitalCertificateMapper.toDomain)
    }

    async findBySerialNumber(serialNumber: string, businessId: string): Promise<DigitalCertificate | null> {
        const certificate = await this.prisma.digitalCertificate.findFirst({
            where: {
                serialNumber: serialNumber,
                businessId: businessId,
            },
            include: {
                certificateFile: true,
                business: true,
            },
        })

        if (!certificate) {
            return null
        }

        return PrismaDigitalCertificateMapper.toDomain(certificate)
    }

    async create(certificate: DigitalCertificate): Promise<void> {
        const data = PrismaDigitalCertificateMapper.toPrisma(certificate)

        await this.prisma.digitalCertificate.create({
            data,
        })
    }

    async save(certificate: DigitalCertificate): Promise<void> {
        const data = PrismaDigitalCertificateMapper.toPrisma(certificate)

        await this.prisma.digitalCertificate.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async deactivateAllFromBusiness(businessId: string): Promise<void> {
        await this.prisma.digitalCertificate.updateMany({
            where: {
                businessId: businessId,
                status: CertificateStatus.ACTIVE,
            },
            data: {
                status: CertificateStatus.INACTIVE,
                updatedAt: new Date(),
            },
        })
    }
}