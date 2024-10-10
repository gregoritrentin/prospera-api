import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

interface SendEmailRequest {
    to: string
    subject: string
    body: string
}

type SendEmailResponse = Either<
    null,
    { jobId: string }
>

@Injectable()
export class SendAndCreateEmailUseCase {
    constructor(
        @InjectQueue('email') private emailQueue: Queue
    ) { }

    async execute({
        to,
        subject,
        body,
    }: SendEmailRequest): Promise<SendEmailResponse> {
        try {

            const job = await this.emailQueue.add('send-email', {
                to,
                subject,
                body,
            })

            return right({
                jobId: job.id.toString(),
            })

        } catch (error) {
            console.error('Erro ao enfileirar e-mail:', error)
            return left(null)
        }
    }
}