import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailUseCase } from '@/domain/email/use-cases/send-email';
import { Email } from '@/domain/email/entities/email';

@Controller('email')
export class EmailController {
    constructor(private readonly sendEmail: SendEmailUseCase) { }

    @Post('send')
    async handle(
        @Body('to') to: string,
        @Body('subject') subject: string,
        @Body('body') body: string,
        @Body('html') html: string,
    ) {

        const email = new Email(to, subject, body, html);

        await this.sendEmail.send(email);

        return { message: 'Email sent successfully' };

    }
}