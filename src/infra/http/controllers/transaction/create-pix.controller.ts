import { BadRequestException, Body, Controller, Post, HttpException, Req, HttpCode } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { CreatePixUseCase } from '@/domain/transaction/use-cases/create-pix';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { I18nService } from '@/i18n/i18n.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AppError } from '@/core/errors/app-errors';
import { TransactionPixPresenter } from '../../presenters/transaction-pix-presenter';


const createPixBodySchema = z.object({
    personId: z.string().uuid().optional(),
    documentType: z.enum(['IMMEDIATE', 'DUEDATE']),
    description: z.string().nullable().optional(),
    dueDate: z.string().datetime().optional(),
    paymentLimitDate: z.string().datetime().nullable().optional(),
    amount: z.number().positive(),
});

class PixRequest extends createZodDto(createPixBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createPixBodySchema);
type CreatePixBodySchema = z.infer<typeof createPixBodySchema>;

@ApiTags('Pix')
@Controller('/pix')
export class CreatePixController {
    constructor(
        private createPix: CreatePixUseCase,
        private i18nService: I18nService
    ) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new Pix',
        description: 'Create a new Pix transaction. Requires Bearer Token authentication.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to en-US.',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] },
    })
    @ApiBody({ type: PixRequest })
    @ApiResponse({ status: 201, description: 'Pix created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Body(bodyValidationPipe) body: CreatePixBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const businessId = user.bus;

        const { personId, documentType, description, dueDate, paymentLimitDate, amount } = body;

        const result = await this.createPix.execute({
            businessId,
            personId,
            documentType,
            description: description ?? undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            paymentLimitDate: paymentLimitDate ? new Date(paymentLimitDate) : undefined,
            amount,
        });

        if (result.isLeft()) {
            const error: any = result.value;
            if (error instanceof AppError) {
                throw new HttpException({
                    statusCode: error.httpStatus,
                    errorCode: error.errorCode,
                    message: this.i18nService.translate(error.translationKey),
                    details: error.details,
                }, error.httpStatus);
            } else {
                throw new BadRequestException(this.i18nService.translate(error.message));
            }
        }

        // Transform the result using the presenter
        return TransactionPixPresenter.toHttp(result.value.pix);
    }
}