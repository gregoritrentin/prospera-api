import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Email } from '@/domain/email/entities/email'
import { EmailRepository } from '@/domain/email/repositories/email-repository'
import { EmailSender } from '@/domain/mailer/email-sender'

interface SendAndCreateEmailRequest {
    to: string
    subject: string
    body: string
    status: string
}

type SendAndCreateEmailResponse = Either<
    null,
    { email: Email }
>

@Injectable()
export class SendAndCreateEmailUseCase {
    constructor(
        private emailRepository: EmailRepository,
        private emailSender: EmailSender,
    ) { }

    async execute({
        to,
        subject,
        body,
    }: SendAndCreateEmailRequest): Promise<SendAndCreateEmailResponse> {

        //enviando e-mail        
        await this.emailSender.send({
            to,
            subject,
            body,
        })

        //gravando no banco
        const email = Email.create({
            to,
            subject,
            body,
            status: 'PENDING',
        })

        await this.emailRepository.create(email)

        return right({
            email,
        })
    }
}
