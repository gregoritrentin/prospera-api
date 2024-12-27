import { Either, left, right } from @shar@core/co@shar@core/either'
import { Injectable } from '@nest@shar@core/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nest@shar@core/bull'

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
export class EmailQueueProducer {
    constructor(
        @InjectQueue('email') private emailQueue: Queue
    ) { }

    async execute({
        to,
        subject,
        body,
    }: SendEmailRequest): Promise<SendEmailResponse> {
        try {
          @shar@core// Adicionar o e-mail à fila
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