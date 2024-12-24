import { PaginationParams } from '@/core/repositories/pagination-params'
import { Invoice } from '@/domain/invoice/entities/invoice'
import { InvoiceDetails } from '../entities/value-objects/invoice-details'

export abstract class InvoiceRepository {
    abstract findById(id: string, businessId: string): Promise<Invoice | null>;
    abstract findByIdDetails(id: string, businessId: string): Promise<InvoiceDetails | null>;
    abstract findMany(params: PaginationParams, businessId: string): Promise<Invoice[]>;
    abstract findByDueDate(dueDate: Date, status?: string): Promise<Invoice[]>;
    abstract save(invoice: Invoice): Promise<void>;
    abstract create(invoice: Invoice): Promise<void>;
}