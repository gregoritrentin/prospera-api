import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { TwoFactorAutentication } from '@/modules/application/domain/entities/two-factor-autentication'
import { TwoFactorAutenticationRepository } from '@/modules/application/domain/repositories/two-factor-autentication'
import { SendWhatsAppUseCase } from '@/modules/whatsapp/domain/use-cases/send-whatsapp'
import { GetUserUseCase } from 'get-user.use-case'
import { TwoFactorType } from '@/core/utils/enums'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { AppError } from '@/core/error/app-errors'
import { randomInt } from 'crypto'

interface CreateTwoFactorAutenticationRequest {
    userId: string
    businessId: string
    type: TwoFactorType
    expirationMinutes?: number
}

type CreateTwoFactorAutenticationResponse = Either<
    AppError,
    {
        Autentication: TwoFactorAutentication
        expiresAt: Date
    }
>

@Injectable()
export class CreateTwoFactorAutenticationUseCase {
    constructor(
        private twoFactorAutenticationRepository: TwoFactorAutenticationRepository,
        private sendWhatsApp: SendWhatsAppUseCase,
        private getUser: GetUserUseCase,
    ) { }

    private generateCode(): string {
        return randomInt(100000, 999999).toString()
    }

    private getMessageContent(code: string, type: TwoFactorType): string {
        const messages = {
            [TwoFactorType.WITHDRAWAL]: `Seu código de verificação para saque é: ${code}`,
            [TwoFactorType.LOGIN]: `Seu código de verificação para login é: ${code}`,
            [TwoFactorType.CHANGE_PASSWORD]: `Seu código de verificação para alteração de senha é: ${code}`,
            [TwoFactorType.DELETE_ACCOUNT]: `Seu código de verificação para exclusão de conta é: ${code}`,
        }

        return `${messages[type]}. Válido por 5 minutos.`
    }

    async execute({
        userId,
        businessId,
        type,
        expirationMinutes = 5,
    }: CreateTwoFactorAutenticationRequest): Promise<CreateTwoFactorAutenticationResponse> {
        try {
            // Busca dados do usuário
            const userResult = await this.getUser.execute({
                userId,
            })

            if (userResult.isLeft()) {
                return left(userResult.value)
            }

            const { user } = userResult.value

            if (!user.phone) {
                return left(AppError.twoFactorUserNoPhone())
            }

            // Verifica se já existe uma verificação ativa
            const existingAutentication = await this.twoFactorAutenticationRepository
                .findActiveByUserAndType(new UniqueEntityID(userId), type)

            if (existingAutentication && existingAutentication.expiresAt > new Date()) {
                return left(AppError.twoFactorAlreadyActive())
            }

            // Gera novo código
            const code = this.generateCode()

            // Calcula expiração
            const expiresAt = new Date()
            expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes)

            // Cria nova verificação
            const Autentication = TwoFactorAutentication.create({
                userId: new UniqueEntityID(userId),
                type,
                code,
                expiresAt,
            })

            // Envia código via WhatsApp
            const whatsappResult = await this.sendWhatsApp.execute({
                businessId,
                to: user.phone,
                content: this.getMessageContent(code, type),
            })

            if (whatsappResult.isLeft()) {
                return left(AppError.twoFactorSendFailed({
                    reason: 'WhatsApp send failed',
                    originalError: whatsappResult.value
                }))
            }

            // Salva verificação
            await this.twoFactorAutenticationRepository.create(Autentication)

            return right({
                Autentication,
                expiresAt,
            })
        } catch (error) {
            return left(AppError.twoFactorSendFailed({

            }))
        }
    }
}