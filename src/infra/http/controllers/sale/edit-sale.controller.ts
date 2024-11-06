import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
    Req,
    UsePipes,
} from '@nestjs/common'
import { Request } from 'express';
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditSaleUseCase } from '@/domain/sale/use-cases/edit-sale'
import { Language } from '@/i18n';
import { SaleStatus } from '@/core/types/enums';

const saleItemSchema = z.object({
    itemId: z.string(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    discountAmount: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
});

const editSaleSchema = z.object({
    businessId: z.string(),
    customerId: z.string().optional(),
    ownerId: z.string(),
    salesPersonId: z.string(),
    channelId: z.string().optional(),
    status: z.nativeEnum(SaleStatus),
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

type EditSaleBody = z.infer<typeof editSaleSchema>

@Controller('/sales/:id')
export class EditSaleController {
    constructor(
        private editSale: EditSaleUseCase,
    ) { }

    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(editSaleSchema))
    async handle(@Body() body: EditSaleBody, @Param('id') saleId: string, @Req() req: Request) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const { items, ...saleData } = body;

        const result = await this.editSale.execute({
            saleId,
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