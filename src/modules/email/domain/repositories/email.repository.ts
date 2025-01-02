import { Email } from "@/core/domain/entities/email.entity"

export abstract class EmailRepository {
    abstract create(email: Email): Promise<void>;
}