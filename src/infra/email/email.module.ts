import { Module } from '@nestjs/common';
import { SendGridService } from '@/infra/email/sendgrid.service';
import { SendEmailUseCase } from '@/domain/email/use-cases/send-email';
import { SendGridRepository } from './sendgrid-repository';
import { EmailRepository } from '@/domain/email/repositories/email-repository';

@Module({
    providers: [
        SendGridService,
        SendEmailUseCase,
        {
            provide: 'EmailRepository',
            useClass: SendGridRepository,
        },

    ],
    exports: [
        SendGridService,
        EmailRepository,
    ],
})
export class EmailModule { }