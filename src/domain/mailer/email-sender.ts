export interface EmailSenderParams {
    to: string
    subject: string
    body: string
}

export abstract class EmailSender {
    abstract send(params: EmailSenderParams): Promise<{ sendId: string }>
}
