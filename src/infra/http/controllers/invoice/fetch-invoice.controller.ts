import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { InvoicePresenter } from '@/infra/http/presenters/invoice-presenter'

import { FetchInvoicesUseCase } from '@/domain/invoice/use-cases/fetch-invoices'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/person')
export class FetchInvoicesController {
    constructor(private fetchInvoice: FetchInvoicesUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {

        const business = user.bus
        const result = await this.fetchInvoice.execute({
            page,
            businessId: business,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const persons = result.value.invoices

        return { persons: persons.map(InvoicePresenter.toHttp) }
    }
}
