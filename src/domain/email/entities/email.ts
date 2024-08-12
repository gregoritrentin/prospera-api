export class Email {
    constructor(
        public readonly to: string,
        public readonly subject: string,
        public readonly body: string,
        public readonly html: string,
    ) { }
}
