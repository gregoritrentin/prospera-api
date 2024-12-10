import { Controller, Post, Body, HttpException, HttpStatus, Logger, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import { SendWhatsAppUseCase } from '@/domain/whatsapp/use-cases/send-whatsapp';
import { ConnectWhatsAppUseCase } from '@/domain/whatsapp/use-cases/connect-whatsapp';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProduces, ApiConsumes } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Create schema and DTO for request validation and Swagger documentation
const sendWhatsAppSchema = z.object({
    businessId: z.string(),
    to: z.string(),
    content: z.string(),
    mediaType: z.enum([
        'image/jpeg',
        'image/png',
        'audio/mpeg',
        'video/mp4',
        'application/pdf',
        'application/octet-stream'
    ]).optional(),
    mediaUrl: z.string().url().optional(),
});

class SendWhatsAppRequestDto extends createZodDto(sendWhatsAppSchema) { }

interface SendWhatsAppRequest {
    businessId: string;
    to: string;
    content: string;
    mediaType?: 'image/jpeg' | 'image/png' | 'audio/mpeg' | 'video/mp4' | 'application/pdf' | 'application/octet-stream';
    mediaUrl?: string;
}

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsAppController {
    private readonly logger = new Logger(WhatsAppController.name);

    constructor(
        private sendWhatsAppUseCase: SendWhatsAppUseCase,
        private connectWhatsAppUseCase: ConnectWhatsAppUseCase
    ) { }

    @Get('connect')
    @ApiOperation({
        summary: 'Connect WhatsApp',
        description: 'Initiates WhatsApp connection and returns QR code for scanning'
    })
    @ApiResponse({
        status: 200,
        description: 'QR code generated successfully',
        content: {
            'image/png': {
                schema: {
                    type: 'string',
                    format: 'binary',
                    description: 'QR code image for WhatsApp Web connection'
                }
            },
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Success message when already connected'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'An unexpected error occurred'
                },
                statusCode: {
                    type: 'number',
                    example: 500
                }
            }
        }
    })
    @ApiProduces('image/png', 'application/json')
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
                const qrImageBuffer = await qrcode.toBuffer(result.value.qrCode);
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', 'inline; filename="whatsapp-qr.png"');
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
    @ApiOperation({
        summary: 'Send WhatsApp message',
        description: 'Sends a WhatsApp message with optional media attachment'
    })
    @ApiConsumes('application/json')
    @ApiBody({
        type: SendWhatsAppRequestDto,
        description: 'Message details',
        schema: {
            type: 'object',
            required: ['businessId', 'to', 'content'],
            properties: {
                businessId: {
                    type: 'string',
                    description: 'Business ID'
                },
                to: {
                    type: 'string',
                    description: 'Recipient phone number in international format',
                    example: '5511999999999'
                },
                content: {
                    type: 'string',
                    description: 'Message content'
                },
                mediaType: {
                    type: 'string',
                    enum: [
                        'image/jpeg',
                        'image/png',
                        'audio/mpeg',
                        'video/mp4',
                        'application/pdf',
                        'application/octet-stream'
                    ],
                    description: 'Type of media being sent'
                },
                mediaUrl: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL of the media to be sent'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Message sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Message sent successfully'
                },
                whatsApp: {
                    type: 'object',
                    description: 'WhatsApp message details'
                },
                details: {
                    type: 'object',
                    properties: {
                        messageId: {
                            type: 'string',
                            description: 'Unique message identifier'
                        },
                        sentAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp when message was sent'
                        },
                        mediaIncluded: {
                            type: 'boolean',
                            description: 'Indicates if media was included in the message'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'An unexpected error occurred'
                },
                statusCode: {
                    type: 'number',
                    example: 500
                }
            }
        }
    })
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