// src/domain/whatsapp/providers/whatsapp-provider.ts

export interface WhatsAppProviderParams {
    to: string;
    content: string;
}

export abstract class WhatsAppProvider {
    abstract send(params: WhatsAppProviderParams): Promise<{ sendId: string }>;

    abstract sendMedia(
        to: string,
        mediaUrl: string,
        mediaType: string,
        content: string
    ): Promise<{ sendId: string }>;

    abstract connect(): Promise<string>;

    abstract getConnectionStatus(): Promise<'CONNECTED' | 'DISCONNECTED' | 'PENDING'>;
}