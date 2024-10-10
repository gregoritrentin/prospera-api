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
import { PrintBoletoUseCase } from '@/domain/transaction/use-cases/print-boleto'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AppError } from '@/core/errors/app-errors'

@Controller('/boleto/print/:id')
export class PrintBoletoController {
    constructor(private printBoleto: PrintBoletoUseCase) { }

    @Get()
    @HttpCode(200)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') boletoId: string,
    ) {
        const result = await this.printBoleto.execute({
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

        const pdfUrl = result.value

        return {
            pdfUrl,
        }
    }
} 