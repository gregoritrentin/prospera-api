import { EmailSender } from '@/domain/mailer/email-sender'
import { Module } from '@nestjs/common'
import { SendGridMailer } from './sendgrid-mailer'
import { EnvModule } from '../env/env.module'

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: EmailSender,
            useClass: SendGridMailer,
        },
    ],
    exports: [EmailSender],

})
export class EmailModule { }
