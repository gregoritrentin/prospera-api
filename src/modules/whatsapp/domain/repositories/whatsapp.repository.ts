import { WhatsApp } from '@/modules/whatsa/domain/entiti/whatsapp'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params';
export abstract class WhatsAppRepository {

    abstract create(whatsapp: WhatsApp): Promise<void>
    abstract save(whatsapp: WhatsApp): Promise<void>
    abstract findById(id: string): Promise<WhatsApp | null>
    abstract findMany({ page }: PaginationParams): Promise<WhatsApp[]>

}