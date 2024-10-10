import { WhatsApp } from '@/domain/whatsapp/entities/whatsapp';

export interface WhatsAppSenderParams {
    to: string
    content: string
}

export abstract class WhatsAppRepository {
    //abstract initialize(): Promise<void>;

    abstract send(props: WhatsAppSenderParams): Promise<{ sendId: string }>;
    //abstract sendMessage(whatsapp: WhatsApp): Promise<void>;

    //abstract onQRCode(callback: (qr: string) => void): void;
    //abstract onReady(callback: () => void): void;
    //abstract onDisconnected(callback: () => void): void;
}


