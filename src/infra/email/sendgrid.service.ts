import { Injectable } from '@nestjs/common'
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendGridService extends MailService {
    constructor() {
        super();
    }
}