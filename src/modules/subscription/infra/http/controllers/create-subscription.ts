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
import { CreateSubscriptionUseCase } from '@/domain/subscription/use-cases/create-subscription'
import { Language } from '@/i18n'
import { SubscriptionStatus, SplitType } from '@core/utils/enums'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const subscriptionItemSchema = z.object({
    itemId: z.string().uuid(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    status: z.string(),
})

const subscriptionSplitSchema = z.object({
    recipientId: z.string().uuid(),
    splitType: z.nativeEnum(SplitType),
    amount: z.number().nonnegative(),
    feeAmount: z.number().nonnegative(),
})

const subscriptionNFSeSchema = z.object({
    serviceCode: z.string(),
    issRetention: z.boolean(),
    inssRetention: z.boolean(),
    inssRate: z.number().nonnegative().optional(),
    incidendeState: z.string(),
    indicendeCity: z.string(),
    retentionState: z.string(),
    retentionCity: z.string(),
    status: z.string(),
})

const createSubscriptionBodySchema = z.object({
    personId: z.string().uuid(),
    price: z.number().nonnegative(),
    notes: z.string().nullable().optional(),
    paymentMethod: z.string(),
    interval: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    nextBillingDate: z.string().datetime(),
    nextAdjustmentDate: z.string().datetime().nullable().optional(),
    items: z.array(subscriptionItemSchema).nonempty(),
    splits: z.array(subscriptionSplitSchema).optional(),
    nfse: subscriptionNFSeSchema.optional(),
})


class SubscriptionRequest extends createZodDto(createSubscriptionBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createSubscriptionBodySchema)
type CreateSubscriptionBodySchema = z.infer<typeof createSubscriptionBodySchema>

@ApiTags('Subscription')
@Controller('/subscriptions')
export class CreateSubscriptionController {
    constructor(private createSubscription: CreateSubscriptionUseCase) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new Subscription',
        description: 'Create a new Subscription. Requires Bearer Token authentication.'
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
    @ApiBody({ type: SubscriptionRequest })
    @ApiResponse({ status: 201, description: 'Subscription created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Body(bodyValidationPipe) body: CreateSubscriptionBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language

        const businessId = user.bus

        const {
            personId,
            price,
            notes,
            paymentMethod,
            interval,
            nextBillingDate,
            nextAdjustmentDate,
            items,
            splits,
            nfse
        } = body

        const result = await this.createSubscription.execute({
            businessId,
            personId,
            price,
            notes: notes ?? undefined,
            paymentMethod,
            interval,
            nextBillingDate: new Date(nextBillingDate),
            nextAdjustmentDate: nextAdjustmentDate ? new Date(nextAdjustmentDate) : undefined,
            //cancellationReason: cancellationReason ?? undefined,
            //cancellationDate: cancellationDate ? new Date(cancellationDate) : undefined,
            //cancellationScheduledDate: cancellationScheduledDate ? new Date(cancellationScheduledDate) : undefined,
            items,
            splits: splits || [],
            nfse: nfse || undefined,
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
            subscription: result.value.subscription,
            message: result.value.message,
        }
    }
}