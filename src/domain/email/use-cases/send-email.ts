import { Injectable } from '@nestjs/common';
import { EmailRepository } from '@/domain/email/repositories/email-repository';
import { Email } from '@/domain/email/entities/email';

@Injectable()
export class SendEmailUseCase {
    constructor(private readonly emailRepository: EmailRepository) { }

    async send(email: Email): Promise<void> {
        await this.emailRepository.send(email);
    }
}