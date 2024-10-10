export interface EmailProviderParams {
    to: string
    subject: string
    body: string
}

export abstract class EmailProvider {
    abstract send(params: EmailProviderParams): Promise<{ sendId: string }>
}
