import { Body, Controller, HttpCode, Post, Req, BadRequestException } from '@nestjs/common'
import { Request } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { CreateNfseUseCase } from 'create-nfse.controller'
import { Language } from '@/i18n'
import { RpsType, OperationType, IssRequirement, ServiceCode } from '@/core/utils/enums'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'

// src/infra/http/controllers/nfse/create-nfse.controller.ts

const createNfseBodySchema = z.object({
    personId: z.string().uuid(),

    // RPS Info
    rpsNumber: z.string(),
    rpsSeries: z.string(),
    rpsType: z.nativeEnum(RpsType),

    // Dates
    issueDate: z.string().datetime(),
    competenceDate: z.string().datetime(),

    // Service
    description: z.string(),
    additionalInformation: z.string().optional(),
    operationType: z.nativeEnum(OperationType),
    serviceCode: z.nativeEnum(ServiceCode),
    issRequirement: z.nativeEnum(IssRequirement),
    cnaeCode: z.string(),
    cityTaxCode: z.string().optional(),
    issRetention: z.boolean(),

    // Values
    serviceAmount: z.number().positive(),
    unconditionalDiscount: z.number().nonnegative().default(0),
    conditionalDiscount: z.number().nonnegative().default(0),
    calculationBase: z.number().positive(),

    // Tax rates
    issRate: z.number().nonnegative(),
    pisRate: z.number().nonnegative().optional(),
    cofinsRate: z.number().nonnegative().optional(),
    irRate: z.number().nonnegative().optional(),
    inssRate: z.number().nonnegative().optional(),
    csllRate: z.number().nonnegative().optional(),

    // Location
    incidenceState: z.string(),
    incidenceCity: z.string(),
    serviceState: z.string(),
    serviceCity: z.string(),
});

class CreateNfseRequest extends createZodDto(createNfseBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createNfseBodySchema);
type CreateNfseBodySchema = z.infer<typeof createNfseBodySchema>;

@ApiTags('NFSe')
@Controller('/nfse')
export class CreateNfseController {
    constructor(private createNfse: CreateNfseUseCase) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new NFSe',
        description: 'Create a new NFSe (Service Invoice). Requires Bearer Token authentication.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for response',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] },
    })
    @ApiBody({ type: CreateNfseRequest })
    @ApiResponse({ status: 201, description: 'NFSe created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Body(bodyValidationPipe) body: CreateNfseBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;
        const businessId = user.bus;

        const result = await this.createNfse.execute({
            businessId,
            personId: body.personId,

            rpsNumber: body.rpsNumber,
            rpsSeries: body.rpsSeries,
            rpsType: body.rpsType,

            issueDate: new Date(body.issueDate),
            competenceDate: new Date(body.competenceDate),

            description: body.description,
            additionalInformation: body.additionalInformation,
            operationType: body.operationType,
            serviceCode: body.serviceCode,
            issRequirement: body.issRequirement,
            cnaeCode: body.cnaeCode,
            cityTaxCode: body.cityTaxCode,
            issRetention: body.issRetention,

            serviceAmount: body.serviceAmount,
            unconditionalDiscount: body.unconditionalDiscount,
            conditionalDiscount: body.conditionalDiscount,
            calculationBase: body.calculationBase,

            issRate: body.issRate,
            pisRate: body.pisRate,
            cofinsRate: body.cofinsRate,
            irRate: body.irRate,
            inssRate: body.inssRate,
            csllRate: body.csllRate,

            incidenceState: body.incidenceState,
            incidenceCity: body.incidenceCity,
            serviceState: body.serviceState,
            serviceCity: body.serviceCity,
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
            jobId: result.value.jobId,
            message: result.value.message,
        };
    }
}