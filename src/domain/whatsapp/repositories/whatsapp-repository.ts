import { PaginationParams } from '@/core/repositories/pagination-params';
import { WhatsApp } from '@/domain/whatsapp/entities/whatsapp';

export abstract class WhatsAppRepository {

    abstract create(whatsapp: WhatsApp): Promise<void>
    abstract save(whatsapp: WhatsApp): Promise<void>
    abstract findById(id: string): Promise<WhatsApp | null>
    abstract findMany({ page }: PaginationParams): Promise<WhatsApp[]>

}


