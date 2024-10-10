import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';
import { Language } from '@/i18n';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const createBoletoBodySchema = z.object({
    personId: z.string().uuid(),
    yourNumber: z.string(),
    ourNumber: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    dueDate: z.string().datetime(),
    paymentLimitDate: z.string().datetime().nullable().optional(),
    amount: z.number() //.positive(),
});

class BoletoRequest extends createZodDto(createBoletoBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createBoletoBodySchema)
type CreateBoletoBodySchema = z.infer<typeof createBoletoBodySchema>;

@ApiTags('Boleto')
@Controller('/boleto')
export class CreateBoletoController {
    constructor(private createBoleto: CreateBoletoUseCase) { }

    @Post()
    @HttpCode(201)

    @ApiOperation({
        summary: 'Create a new Boleto',
        description: 'Create a new Boleto transaction. Requires Bearer Token authentication.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token. Example: Bearer YOUR_TOKEN_HERE',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to pt-BR.',
        required: false,
        schema: { type: 'string', default: 'pt-BR', enum: ['pt-BR', 'en-US'] }, // Ajuste os idiomas conforme necessário
    })

    @ApiBody({ type: BoletoRequest })
    @ApiResponse({ status: 201, description: 'Boleto created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing Bearer Token' })

    async handle(

        @Body(bodyValidationPipe) body: CreateBoletoBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request) {

        const language = ((req.headers['accept-language'] as string) || 'pt-BR') as Language;

        const businessId = user.bus;

        const { personId, yourNumber, ourNumber, description, dueDate, paymentLimitDate, amount } = body;

        const result = await this.createBoleto.execute({
            businessId,
            personId,
            yourNumber,
            ourNumber: ourNumber ?? undefined,
            description: description ?? undefined,
            dueDate: new Date(dueDate),
            paymentLimitDate: paymentLimitDate ? new Date(paymentLimitDate) : undefined,
            amount,
        }, language);

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            });
        }

        return {
            boleto: result.value.boleto,
            message: result.value.message,
        };
    }
}