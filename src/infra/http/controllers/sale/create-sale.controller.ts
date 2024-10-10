import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common'
import { Request } from 'express';
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateSaleUseCase } from '@/domain/sale/use-cases/create-sale'
import { Language } from '@/i18n';

const saleItemSchema = z.object({
    itemId: z.string(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    discountAmount: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
});

const createSaleSchema = z.object({
    businessId: z.string(),
    customerId: z.string().optional(),
    ownerId: z.string(),
    salesPersonId: z.string(),
    channelId: z.string().optional(),
    issueDate: z.string().transform((str) => new Date(str)),
    status: z.string(),
    notes: z.string().optional(),
    servicesAmount: z.number().nonnegative(),
    productAmount: z.number().nonnegative(),
    grossAmount: z.number().nonnegative(),
    discountAmount: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
    shippingAmount: z.number().nonnegative(),
    items: z.array(saleItemSchema).nonempty(),
});

type CreateSaleBody = z.infer<typeof createSaleSchema>

@Controller('/sales')
export class CreateSaleController {
    constructor(
        private createSale: CreateSaleUseCase,
    ) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createSaleSchema))
    async handle(@Body() body: CreateSaleBody, @Req() req: Request) {

        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;


        const { items, ...saleData } = body;

        const result = await this.createSale.execute({
            ...saleData,
            items,
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
            sale: result.value.sale,
            message: result.value.message,
        };
    }
}