import { Email } from "../entities/email";

export abstract class EmailRepository {
    abstract send(email: Email): Promise<void>;
}
