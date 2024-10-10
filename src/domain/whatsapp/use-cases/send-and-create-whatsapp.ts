import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WhatsApp } from '../entities/whatsapp';
import { WhatsAppRepository } from '../repositories/whatsapp-repository';

interface SendAndCreatewhatsAppRequest {
    to: string
    content: string
    status: string
}

type SendAndCreateWhatsAppResponse = Either<
    null,
    { whatsApp: WhatsApp }
>

@Injectable()
export class SendAndCreateWhatsApplUseCase {
    constructor(
        private whatsAppRepository: WhatsAppRepository,

    ) { }

    async execute({
        to,
        content,
    }: SendAndCreatewhatsAppRequest): Promise<SendAndCreateWhatsAppResponse> {

        //enviando whatsapp        
        await this.whatsAppRepository.send({
            to,
            content,
        })


        const whatsApp = WhatsApp.create({
            to,
            content,
            status: 'PENDING',
        })


        return right({
            whatsApp,
        })
    }
}
