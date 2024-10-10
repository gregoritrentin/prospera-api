import { Email } from "../entities/email";

export abstract class EmailRepository {
    abstract create(email: Email): Promise<void>;
}