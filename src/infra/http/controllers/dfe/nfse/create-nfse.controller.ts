import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
} from '@nestjs/common'
import { Request } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateNfseUseCase } from '@/domain/dfe/nfse/use-cases/create-nfse'
import { Language } from '@/i18n'
import { RpsType, OperationType, IssRequirement, ServiceCode } from '@/core/types/enums'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createNfseBodySchema = z.object({
    personId: z.string().uuid(),

    // RPS Info
    rpsNumber: z.string(),
    rpsSeries: z.string(),
    rpsType: z.nativeEnum(RpsType),

    // Dates
    issueDate: z.string().datetime(),
    competenceDate: z.string().datetime(),

    // Service Description
    description: z.string(),
    additionalInformation: z.string().nullable().optional(),
    operationType: z.nativeEnum(OperationType),
    serviceCode: z.nativeEnum(ServiceCode),
    issRequirement: z.nativeEnum(IssRequirement),
    cnaeCode: z.string(),
    cityTaxCode: z.string().nullable().optional(),
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
    serviceCity: z.string()
})

class NfseRequest extends createZodDto(createNfseBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createNfseBodySchema)
type CreateNfseBodySchema = z.infer<typeof createNfseBodySchema>

@ApiTags('NFSe')
@Controller('/nfse')
export class CreateNfseController {
    constructor(private createNfse: CreateNfseUseCase) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new NFSe',
        description: 'Create a new NFSe (Nota Fiscal de Serviço Eletrônica). Requires Bearer Token authentication.'
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
    @ApiBody({ type: NfseRequest })
    @ApiResponse({ status: 201, description: 'NFSe creation queued successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Body(bodyValidationPipe) body: CreateNfseBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language

        const businessId = user.bus

        const {
            personId,
            rpsNumber,
            rpsSeries,
            rpsType,
            issueDate,
            competenceDate,
            description,
            additionalInformation,
            operationType,
            serviceCode,
            issRequirement,
            cnaeCode,
            cityTaxCode,
            issRetention,
            serviceAmount,
            unconditionalDiscount,
            conditionalDiscount,
            calculationBase,
            issRate,
            pisRate,
            cofinsRate,
            irRate,
            inssRate,
            csllRate,
            incidenceState,
            incidenceCity,
            serviceState,
            serviceCity
        } = body

        const result = await this.createNfse.execute({
            businessId,
            personId,
            rpsNumber,
            rpsSeries,
            rpsType,
            issueDate: new Date(issueDate),
            competenceDate: new Date(competenceDate),
            description,
            additionalInformation: additionalInformation ?? undefined,
            operationType,
            serviceCode,
            issRequirement,
            cnaeCode,
            cityTaxCode: cityTaxCode ?? undefined,
            issRetention,
            serviceAmount,
            unconditionalDiscount,
            conditionalDiscount,
            calculationBase,
            issRate,
            pisRate: pisRate ?? 0,
            cofinsRate: cofinsRate ?? 0,
            irRate: irRate ?? 0,
            inssRate: inssRate ?? 0,
            csllRate: csllRate ?? 0,
            incidenceState,
            incidenceCity,
            serviceState,
            serviceCity
        }, language)

        if (result.isLeft()) {
            const error = result.value
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            })
        }

        return {
            jobId: result.value.jobId,
            message: result.value.message,
        }
    }
}