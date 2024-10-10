import { WhatsAppRepository, WhatsAppSenderParams } from '@/domain/whatsApp/repositories/whatsapp-repository'
import { WhatsApp } from '@/domain/whatsapp/entities/whatsapp';
import { Injectable } from '@nestjs/common'
import { Client } from 'whatsapp-web.js';

@Injectable()
export class WhatsAppWeb implements WhatsAppRepository {

    constructor(private whatsAppRepository: WhatsAppRepository) { }

    async send(params: WhatsAppSenderParams): Promise<{ sendId: string }> {

        const whatsApp = WhatsApp.create({
            to: params.to,
            content: params.content,
            status: 'PENDING',
        });

        await this.whatsAppRepository.send(whatsApp);

        return { sendId: whatsApp.id.toString() };
    }
}
