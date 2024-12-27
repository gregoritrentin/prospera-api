import { EmailProviderParams, EmailProvider } from '@/domain/providers/email-provider'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { MailService } from '@sendgrid/mail'

@Injectable()
export class SendGridService implements EmailProvider {
    private sgMail: MailService

    constructor(private envService: EnvService) {
        const sendGridApiKey = this.envService.get('SENDGRID_API_KEY')
        this.sgMail = new MailService()
        this.sgMail.setApiKey(sendGridApiKey)
    }

    async send({
        to,
        subject,
        body,
    }: EmailProviderParams): Promise<{ sendId: string }> {
        const sendId = randomUUID()

        const msg = {
            to,
            from: this.envService.get('SENDGRID_FROM_EMAIL'),
            subject,
            html: body,
        }

        await this.sgMail.send(msg)

        return {
            sendId,
        }
    }
}