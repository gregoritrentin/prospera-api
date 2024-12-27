import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
    Req,
    UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { EditNfseUseCase } from '@/domain/dfe/nfse/use-cases/edit-nfse';
import { Language } from '@/i18n';
import {
    RpsType,
    OperationType,
    IssRequirement,
    ServiceCode,
    NfseStatus
} from '@core/utils/enums';

const editNfseSchema = z.object({
    businessId: z.string(),
    personId: z.string(),

    // RPS Info
    rpsNumber: z.string(),
    rpsSeries: z.string(),
    rpsType: z.nativeEnum(RpsType),

    // Dates
    issueDate: z.coerce.date(),
    competenceDate: z.coerce.date(),

    // Service Description
    description: z.string(),
    additionalInformation: z.string().optional().nullable(),
    operationType: z.nativeEnum(OperationType),
    serviceCode: z.nativeEnum(ServiceCode),
    issRequirement: z.nativeEnum(IssRequirement),
    cnaeCode: z.string(),
    cityTaxCode: z.string().optional().nullable(),
    issRetention: z.boolean(),

    // Values
    serviceAmount: z.number().nonnegative(),
    unconditionalDiscount: z.number().nonnegative(),
    conditionalDiscount: z.number().nonnegative(),
    calculationBase: z.number().nonnegative(),
    netAmount: z.number().nonnegative(),

    // Tax Rates
    issRate: z.number().nonnegative(),
    pisRate: z.number().nonnegative(),
    cofinsRate: z.number().nonnegative(),
    irRate: z.number().nonnegative(),
    inssRate: z.number().nonnegative(),
    csllRate: z.number().nonnegative(),

    // Tax Amounts
    issAmount: z.number().nonnegative(),
    pisAmount: z.number().nonnegative(),
    cofinsAmount: z.number().nonnegative(),
    inssAmount: z.number().nonnegative(),
    irAmount: z.number().nonnegative(),
    csllAmount: z.number().nonnegative(),
    otherRetentions: z.number().nonnegative(),

    // Location
    incidenceState: z.string(),
    incidenceCity: z.string(),
    serviceState: z.string(),
    serviceCity: z.string(),

    // Control
    status: z.nativeEnum(NfseStatus),
    batchNumber: z.string().optional().nullable(),
    protocol: z.string().optional().nullable(),
    nfseNumber: z.string().optional().nullable(),

    substituteNfseNumber: z.string().optional().nullable(),
    substituteReason: z.string().optional().nullable(),
    cancelReason: z.string().optional().nullable(),
});

type EditNfseBody = z.infer<typeof editNfseSchema>

@Controller('/nfse/:id')
export class EditNfseController {
    constructor(
        private editNfse: EditNfseUseCase,
    ) { }

    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(editNfseSchema))
    async handle(
        @Body() body: EditNfseBody,
        @Param('id') nfseId: string,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const result = await this.editNfse.execute({
            nfseId,
            ...body,
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
            nfse: result.value.nfse,
            message: result.value.message,
        };
    }
}