import { UniqueEntityID } from "@core/domain/entity/unique-entity-id";
import { TwoFactorType } from "@core/utils/enums";
import { TwoFactorAutentication } from "../entities/two-factor-autentication";

export abstract class TwoFactorAutenticationRepository {
    abstract create(Autentication: TwoFactorAutentication): Promise<void>
    abstract findActiveByUserAndType(
        userId: UniqueEntityID,
        type: TwoFactorType
    ): Promise<TwoFactorAutentication | null>
    abstract save(Autentication: TwoFactorAutentication): Promise<void>
}