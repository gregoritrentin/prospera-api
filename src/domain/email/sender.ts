
export interface EmailParams {
    to: string
    from: string
    subject: string
    text: string
    html: string
}

export abstract class Sender {
    abstract send(params: EmailParams): Promise<{ url: string }>
}
