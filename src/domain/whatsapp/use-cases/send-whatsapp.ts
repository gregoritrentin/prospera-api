import { Injectable, Logger } from '@nestjs/common';
import { Either, right, left } from '@/core/either';
import { WhatsApp } from '../entities/whatsapp';
import { WhatsAppRepository } from '../repositories/whatsapp-repository';
import { WhatsAppProvider } from '@/domain/interfaces/whatsapp-provider';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface SendWhatsAppRequest {
    businessId: string;
    to: string;
    content: string;
    mediaType?: string;
    mediaUrl?: string;
}

type SendWhatsAppResponse = Either<
    Error,
    { whatsApp: WhatsApp; details: { messageId: string; sentAt: Date; mediaIncluded: boolean } }
>;

@Injectable()
export class SendWhatsAppUseCase {
    private readonly logger = new Logger(SendWhatsAppUseCase.name);

    constructor(
        private whatsAppRepository: WhatsAppRepository,
        private whatsAppProvider: WhatsAppProvider,
    ) { }

    async execute({
        businessId,
        to,
        content,
        mediaType,
        mediaUrl,
    }: SendWhatsAppRequest): Promise<SendWhatsAppResponse> {
        this.logger.log(`Executing SendWhatsAppUseCase with params: ${JSON.stringify({ businessId, to, content, mediaType, mediaUrl })}`);

        try {
            let sendResult: { sendId: string };

            if (mediaUrl && mediaType) {
                this.logger.log(`Sending media message: ${mediaUrl}`);
                sendResult = await this.whatsAppProvider.sendMedia(to, mediaUrl, mediaType, content);
            } else {
                this.logger.log('Sending text-only message');
                sendResult = await this.whatsAppProvider.send({ to, content });
            }

            this.logger.log(`Message sent successfully. SendId: ${sendResult.sendId}`);

            const whatsApp = WhatsApp.create({
                businessId: new UniqueEntityID(businessId),
                to,
                content,
                status: 'SENT',
                mediaType,
                mediaUrl,
            });

            await this.whatsAppRepository.create(whatsApp);
            this.logger.log(`WhatsApp entity created and saved. Id: ${whatsApp.id.toString()}`);

            return right({
                whatsApp,
                details: {
                    messageId: sendResult.sendId,
                    sentAt: whatsApp.createdAt,
                    mediaIncluded: !!mediaUrl
                }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to send WhatsApp: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
            return left(new Error(`Failed to send WhatsApp: ${errorMessage}`));
        }
    }
}