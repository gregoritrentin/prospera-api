import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SaleDetails } from '@/domain/sale/entities/value-objects/sale-details'
import { Prisma } from '@prisma/client'

type PrismaSaleDetails = Prisma.SaleGetPayload<{
    include: {
        business: true;
        customer: true;
        owner: true;
        salesPerson: true;
        channel: true;
    }
}>
export class PrismaSaleDetailsMapper {
    static toDomain(raw: PrismaSaleDetails): SaleDetails {
        return SaleDetails.create({
            businessId: new UniqueEntityID(raw.businessId),
            customerId: raw.customerId ? new UniqueEntityID(raw.customerId) : undefined,
            customerName: raw.customer?.name,
            ownerId: new UniqueEntityID(raw.ownerId),
            ownerName: raw.owner.name,
            salesPersonId: new UniqueEntityID(raw.salesPersonId),
            salesPersonName: raw.salesPerson.name,
            channelId: raw.channelId ? new UniqueEntityID(raw.channelId) : undefined,
            channelName: raw.channel?.name ?? '',
            issueDate: raw.issueDate,
            status: raw.status,
            notes: raw.notes,
            servicesAmount: raw.servicesAmount,
            productAmount: raw.productAmount,
            grossAmount: raw.grossAmount,
            discountAmount: raw.discountAmount,
            amount: raw.amount,
            commissionAmount: raw.commissionAmount,
            shippingAmount: raw.shippingAmount,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        })
    }

    // static toPrisma(saleDetails: SaleDetails): Prisma.SaleCreateInput {
    //     return {
    //         business: { connect: { id: saleDetails.businessId.toString() } },
    //         customer: saleDetails.customerId
    //             ? { connect: { id: saleDetails.customerId.toString() } }
    //             : undefined,
    //         owner: { connect: { id: saleDetails.ownerId.toString() } },
    //         salesPerson: { connect: { id: saleDetails.salesPersonId.toString() } },
    //         channel: saleDetails.channelId
    //             ? { connect: { id: saleDetails.channelId.toString() } }
    //             : undefined,
    //         issueDate: saleDetails.issueDate,
    //         status: saleDetails.status,
    //         notes: saleDetails.notes,
    //         servicesAmount: saleDetails.servicesAmount,
    //         productAmount: saleDetails.productAmount,
    //         grossAmount: saleDetails.grossAmount,
    //         discountAmount: saleDetails.discountAmount,
    //         amount: saleDetails.amount,
    //         commissionAmount: saleDetails.commissionAmount,
    //         shippingAmount: saleDetails.shippingAmount,
    //         createdAt: saleDetails.createdAt,
    //         updatedAt: saleDetails.updatedAt
    //     }
    // }
}