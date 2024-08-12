import { Injectable } from '@nestjs/common';
import { Email } from '@/domain/email/entities/email';
import { EmailRepository } from '@/domain/email/repositories/email-repository';
import { SendGridService } from '@/infra/email/sendgrid.service';

@Injectable()
export class SendGridRepository implements EmailRepository {
    constructor(private sendgrid: SendGridService) {



    }

    async send(email: Email): Promise<void> {
        const msg = {
            to: email.to,
            from: 'nao-responda@prosperaerp.com',
            subject: email.subject,
            text: email.body,
            html: email.body,
        };

        await this.sendgrid.send(msg);

    }
}