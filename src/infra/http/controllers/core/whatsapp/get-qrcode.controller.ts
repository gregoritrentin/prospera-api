// import { Controller, Get } from '@nestjs/common';
// import { WhatsAppWebRepository } from './what';

// @Controller('whatsapp')
// export class WhatsAppQRController {
//     constructor(private whatsAppRepository: WhatsAppWebRepository) { }

//     @Get('qr')
//     async getQRCode() {

//         const qrCode = await this.whatsAppRepository.getStoredQRCode();
//         if (qrCode) {
//             return { qrCode };
//         } else {
//             return { message: 'QR Code não disponível ou já autenticado' };
//         }

//     }
// }