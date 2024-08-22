import { EmailSenderParams, EmailSender } from '@/domain/mailer/email-sender'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridMailer implements EmailSender {

    constructor(private envService: EnvService) {

        const sendGridApiKey = envService.get('SENDGRID_API_KEY')

        sgMail.setApiKey(sendGridApiKey);

    }

    async send({
        to,
        subject,
        body,
    }: EmailSenderParams): Promise<{ sendId: string }> {

        const sendId = randomUUID();

        const msg = {
            to,
            from: this.envService.get('SENDGRID_FROM_EMAIL'),
            subject,
            html: body,
        };

        await sgMail.send(msg);

        return {
            sendId,
        }
    }
}

