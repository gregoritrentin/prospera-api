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
import { EditSubscriptionUseCase } from '@/domain/subscription/use-cases/edit-subscription';
import { Language } from '@/i18n';
import { SubscriptionStatus } from '@/core/types/enums';

const subscriptionItemSchema = z.object({
    itemId: z.string(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    status: z.string(),
});

const subscriptionSplitSchema = z.object({
    recipientId: z.string(),
    splitType: z.string(),
    amount: z.number().nonnegative(),
    feeAmount: z.number().nonnegative(),
});

const subscriptionNFSeSchema = z.object({
    serviceCode: z.string(),
    issRetention: z.boolean(),
    inssRetention: z.boolean(),
    inssRate: z.number().nonnegative(),
    incidendeState: z.string(),
    indicendeCity: z.string(),
    retentionState: z.string(),
    retentionCity: z.string(),
    status: z.string(),
});

const editSubscriptionSchema = z.object({
    businessId: z.string(),
    personId: z.string(),
    price: z.number().nonnegative(),
    notes: z.string().optional(),
    paymentMethod: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    nextBillingDate: z.coerce.date(),
    nextAdjustmentDate: z.coerce.date().optional(),
    interval: z.string(),
    cancellationReason: z.string().optional(),
    cancellationDate: z.coerce.date().optional(),
    cancellationScheduledDate: z.coerce.date().optional(),
    items: z.array(subscriptionItemSchema),
    splits: z.array(subscriptionSplitSchema).optional(),
    nfse: subscriptionNFSeSchema.optional(),
});

type EditSubscriptionBody = z.infer<typeof editSubscriptionSchema>

@Controller('/subscriptions/:id')
export class EditSubscriptionController {
    constructor(
        private editSubscription: EditSubscriptionUseCase,
    ) { }

    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(editSubscriptionSchema))
    async handle(
        @Body() body: EditSubscriptionBody,
        @Param('id') subscriptionId: string,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const { items, splits, nfse, ...subscriptionData } = body;

        const result = await this.editSubscription.execute({
            subscriptionId,
            ...subscriptionData,
            items,
            splits: splits || [],
            nfse: nfse || undefined,
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
            subscription: result.value.subscription,
            message: result.value.message,
        };
    }
}