
export interface EmailSenderParams {
    to: string
    from: string
    subject: string
    text: string
    html: string
}

export abstract class Sender {
    abstract send(params: EmailSenderParams): Promise<{ url: string }>
}
