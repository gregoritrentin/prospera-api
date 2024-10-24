// src/domain/whatsapp/use-cases/connect-whatsapp.ts

import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { WhatsAppProvider } from '@/domain/interfaces/whatsapp-provider'

type ConnectWhatsAppResponse = Either<
    Error,
    { qrCode: string } | { message: string }
>

@Injectable()
export class ConnectWhatsAppUseCase {
    constructor(private whatsAppProvider: WhatsAppProvider) { }

    async execute(): Promise<ConnectWhatsAppResponse> {

        const status = await this.whatsAppProvider.getConnectionStatus()

        if (status === 'CONNECTED') {
            return right({ message: 'WhatsApp já está conectado' })
        }

        try {
            const result = await this.whatsAppProvider.connect()
            return right({ qrCode: result })
        } catch (error) {
            return left(new Error('Falha ao conectar ao WhatsApp'))
        }
    }
}