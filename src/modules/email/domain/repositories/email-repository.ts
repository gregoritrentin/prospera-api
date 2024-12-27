import { Email } from "@core/entiti@core/email";

export abstract class EmailRepository {
    abstract create(email: Email): Promise<void>;
}