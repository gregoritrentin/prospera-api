// import { Controller, Get } from '@nestjs/common'
// import { WhatsAppRepository } from '@/domain/whatsapp/repositories/whatsapp-repository'
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

// @ApiTags('WhatsApp')
// @Controller('whatsapp')
// export class WhatsAppQRController {
//     constructor(private whatsAppRepository: WhatsAppRepository) { }

//     @Get('qr')
//     @ApiOperation({
//         summary: 'Get WhatsApp QR Code',
//         description: 'Retrieves the current WhatsApp Web QR Code for authentication'
//     })
//     @ApiResponse({
//         status: 200,
//         description: 'QR Code retrieved successfully',
//         schema: {
//             type: 'object',
//             properties: {
//                 qrCode: {
//                     type: 'string',
//                     description: 'Base64 encoded QR Code image',
//                     nullable: true
//                 },
//                 message: {
//                     type: 'string',
//                     description: 'Status message when QR Code is not available',
//                     example: 'QR Code not available or already authenticated'
//                 }
//             }
//         }
//     })
//     @ApiResponse({
//         status: 500,
//         description: 'Internal server error',
//         schema: {
//             type: 'object',
//             properties: {
//                 message: {
//                     type: 'string',
//                     description: 'Error message',
//                     example: 'Error retrieving QR Code'
//                 }
//             }
//         }
//     })
//     async getQRCode() {
//         const qrCode = await this.whatsAppRepository.getStoredQRCode()

//         if (qrCode) {
//             return { qrCode }
//         }

//         return {
//             message: 'QR Code not available or already authenticated'
//         }
//     }
// }