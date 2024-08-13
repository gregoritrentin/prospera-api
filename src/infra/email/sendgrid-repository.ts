import { Injectable } from '@nestjs/common';
import { Email } from '@/domain/email/entities/email';
import { EmailRepository } from '@/domain/email/repositories/email-repository';
import * as SendGridMail from '@sendgrid/mail';

@Injectable()
export class SendGridRepository implements EmailRepository {
    constructor() { }

    async send(email: Email): Promise<void> {
        const msg = {
            from: 'nao-responda@prosperaerp.com',
            to: email.to,
            subject: email.subject,
            text: email.text,
            html: email.html,
        };

        await SendGridMail.send(msg);

    }
}