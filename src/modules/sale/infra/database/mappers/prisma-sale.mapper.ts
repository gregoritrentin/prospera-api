import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { SaleStatus } from '@/core/utils/enums'
import { Sale } from '@/modules/sale/domain/entities/sale'
import { SaleItem } from '@/modules/sale/domain/entities/sale-item'
import { Sale as PrismaSale, SaleItem as PrismaSaleItem, Prisma } from '@prisma/client'

export class PrismaSaleMapper {
    static toDomain(raw: PrismaSale & { items?: PrismaSaleItem[] }): Sale {
        return Sale.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                customerId: raw.customerId ? new UniqueEntityID(raw.customerId) : undefined,
                ownerId: new UniqueEntityID(raw.ownerId),
                salesPersonId: new UniqueEntityID(raw.salesPersonId),
                channelId: raw.channelId ? new UniqueEntityID(raw.channelId) : undefined,
                issueDate: raw.issueDate,
                status: raw.status as SaleStatus,
                notes: raw.notes,
                servicesAmount: raw.servicesAmount,
                productAmount: raw.productAmount,
                grossAmount: raw.grossAmount,
                discountAmount: raw.discountAmount,
                amount: raw.amount,
                commissionAmount: raw.commissionAmount,
                shippingAmount: raw.shippingAmount,
                items: raw.items?.map(item => SaleItem.create(
                    {
                        saleId: new UniqueEntityID(raw.id),
                        itemId: new UniqueEntityID(item.itemId),
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discountAmount: item.discountAmount,
                        commissionAmount: item.commissionAmount,
                        totalPrice: item.totalPrice,
                    },
                    new UniqueEntityID(item.id)
                )) || [],
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(sale: Sale): Prisma.SaleUncheckedCreateInput & { items: Prisma.SaleItemCreateManyInput[] } {
        return {
            id: sale.id.toString(),
            businessId: sale.businessId.toString(),
            customerId: sale.customerId?.toString(),
            ownerId: sale.ownerId.toString(),
            salesPersonId: sale.salesPersonId.toString(),
            channelId: sale.channelId?.toString(),
            issueDate: sale.issueDate,
            status: sale.status,
            notes: sale.notes,
            servicesAmount: sale.servicesAmount,
            productAmount: sale.productAmount,
            grossAmount: sale.grossAmount,
            discountAmount: sale.discountAmount,
            amount: sale.amount,
            commissionAmount: sale.commissionAmount,
            shippingAmount: sale.shippingAmount,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            items: sale.items.map(item => ({
                id: item.id.toString(),
                saleId: sale.id.toString(),
                itemId: item.itemId.toString(),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discountAmount: item.discountAmount,
                commissionAmount: item.commissionAmount,
                totalPrice: item.totalPrice,
            })),
        }
    }
}