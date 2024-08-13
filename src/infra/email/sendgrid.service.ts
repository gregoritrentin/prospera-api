import { Injectable } from '@nestjs/common'
import { MailService } from '@sendgrid/mail';
import * as sgMail from '@sendgrid/mail';
import { EnvService } from '../env/env.service';

@Injectable()
export class SendGridService extends MailService {
    constructor(envService: EnvService) {
        super()
        sgMail.setApiKey(envService.get('SENDGRID_API_KEY'))

    }

}