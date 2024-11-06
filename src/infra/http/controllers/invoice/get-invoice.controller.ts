import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetInvoiceUseCase } from '@/domain/invoice/use-cases/get-invoice'
import { InvoicePresenter } from '@/infra/http/presenters/invoice-presenter'

@Controller('/invoice/:id')
export class GetInvoiceController {
    constructor(private getInvoice: GetInvoiceUseCase) { }

    @Get()
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') invoiceId: string,
    ) {

        const businessId = user.bus

        const result = await this.getInvoice.execute({
            businessId: businessId,
            invoiceId: invoiceId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const invoice = result.value.invoice

        return InvoicePresenter.toHttp(invoice)
    }
}
