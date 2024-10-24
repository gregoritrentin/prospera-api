import { Controller, Post, Body, HttpException, HttpStatus, Logger, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import { SendWhatsAppUseCase } from '@/domain/whatsapp/use-cases/send-whatsapp';
import { ConnectWhatsAppUseCase } from '@/domain/whatsapp/use-cases/connect-whatsapp';

interface SendWhatsAppRequest {
    businessId: string;
    to: string;
    content: string;
    mediaType?: 'image/jpeg' | 'image/png' | 'audio/mpeg' | 'video/mp4' | 'application/pdf' | 'application/octet-stream';
    mediaUrl?: string;
}

@Controller('whatsapp')
export class WhatsAppController {
    private readonly logger = new Logger(WhatsAppController.name);

    constructor(
        private sendWhatsAppUseCase: SendWhatsAppUseCase,
        private connectWhatsAppUseCase: ConnectWhatsAppUseCase
    ) { }

    @Get('connect')
    async connect(@Res() res: Response) {
        this.logger.log('Received request to connect WhatsApp');

        try {
            const result = await this.connectWhatsAppUseCase.execute();

            if (result.isLeft()) {
                this.logger.error(`Failed to connect WhatsApp: ${result.value.message}`);
                throw new HttpException(result.value.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            if ('qrCode' in result.value) {
                this.logger.log('QR code generated for WhatsApp connection');

                // Generate QR code image
                const qrImageBuffer = await qrcode.toBuffer(result.value.qrCode);

                // Set response headers
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', 'inline; filename="whatsapp-qr.png"');

                // Send the image
                res.send(qrImageBuffer);
            } else {
                this.logger.log('WhatsApp connected successfully');
                res.json({ message: result.value.message });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Unexpected error in connect: ${errorMessage}`);
            throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Post('send')
    async sendMessage(@Body() body: SendWhatsAppRequest) {
        this.logger.log(`Received request to send WhatsApp message: ${JSON.stringify(body)}`);

        try {
            const result = await this.sendWhatsAppUseCase.execute(body);

            if (result.isLeft()) {
                this.logger.error(`Failed to send WhatsApp message: ${result.value.message}`);
                throw new HttpException(result.value.message, HttpStatus.BAD_REQUEST);
            }

            const { whatsApp, details } = result.value;
            this.logger.log(`Successfully sent WhatsApp message: ${JSON.stringify(whatsApp)}`);

            return {
                message: 'Message sent successfully',
                whatsApp,
                details: {
                    messageId: details.messageId,
                    sentAt: details.sentAt,
                    mediaIncluded: details.mediaIncluded
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Unexpected error in sendMessage: ${errorMessage}`);
            throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}