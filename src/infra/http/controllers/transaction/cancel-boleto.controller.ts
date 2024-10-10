import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    InternalServerErrorException,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CancelBoletoUseCase } from '@/domain/transaction/use-cases/cancel-boleto'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AppError } from '@/core/errors/app-errors'

@Controller('/boleto/cancel/:id')
export class CancelBoletoController {
    constructor(private cancelBoleto: CancelBoletoUseCase) { }

    @Get()
    @HttpCode(200)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') boletoId: string,
    ) {
        const result = await this.cancelBoleto.execute({
            businessId: user.bus,
            boletoId: boletoId,
        })

        if (result.isLeft()) {
            const error = result.value

            if (error instanceof AppError.resourceNotFound) {
                throw new NotFoundException('Boleto não encontrado')
            }
            if (error instanceof AppError.notAllowed) {
                throw new BadRequestException('Operação não permitida')
            }

            throw new InternalServerErrorException('Erro ao processar o boleto')
        }

        return {}
    }
} 