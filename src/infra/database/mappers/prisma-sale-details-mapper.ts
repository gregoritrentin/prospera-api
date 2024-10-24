import { Sale as PrismaSale, Business as PrismaBusiness, Person as PrismaPerson, SalesChannel as PrismaChannel, User as PrismaOwner } from '@prisma/client'
import { SaleDetails } from '@/domain/sale/entities/value-objects/sale-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaSaleWithRelations = PrismaSale & {
    business: PrismaBusiness
    customer?: PrismaPerson | null
    owner: PrismaOwner
    salesPerson: PrismaPerson
    salesChannel?: PrismaChannel | null
}

export class PrismaSaleDetailsMapper {
    static toDomain(raw: PrismaSaleWithRelations): SaleDetails {
        return SaleDetails.create({
            // Business data
            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,

            // Customer data
            customerId: raw.customer ? new UniqueEntityID(raw.customer.id) : undefined,
            customerName: raw.customer?.name,

            // Owner data
            ownerId: new UniqueEntityID(raw.owner.id),
            ownerName: raw.owner.name,

            // Sales Person data
            salesPersonId: new UniqueEntityID(raw.salesPerson.id),
            salesPersonName: raw.salesPerson.name,

            // Channel data
            channelId: raw.salesChannel ? new UniqueEntityID(raw.salesChannel.id) : undefined,
            channelName: raw.salesChannel?.name ?? '',

            // Sale data
            issueDate: raw.issueDate,
            status: raw.status,
            notes: raw.notes,

            // Amounts
            servicesAmount: raw.servicesAmount,
            productAmount: raw.productAmount,
            grossAmount: raw.grossAmount,
            discountAmount: raw.discountAmount,
            amount: raw.amount,
            commissionAmount: raw.commissionAmount,
            shippingAmount: raw.shippingAmount,

            // System dates
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}