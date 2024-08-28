import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditBusinessUseCase } from '@/domain/core/use-cases/edit-business'

const editBusinessBodySchema = z.object({
    marketplaceId: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    ie: z.string(),
    im: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    state: z.string(),
    city: z.string(),
    businessSize: z.string(),
    businessType: z.string(),
    status: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editBusinessBodySchema)

type EditBusinessBodySchema = z.infer<typeof editBusinessBodySchema>

@Controller('/business/:id')
export class EditBusinessController {
    constructor(private editBusiness: EditBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessBodySchema,
        @Param('id') businessId: string,
    ) {
        const {
            marketplaceId,
            name,
            email,
            phone,
            document,
            ie,
            im,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            state,
            city,
            businessSize,
            businessType,
            status
        } = body



        const result = await this.editBusiness.execute({
            businessId,
            marketplaceId,
            name,
            email,
            phone,
            document,
            ie,
            im,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            state,
            city,
            businessSize,
            businessType,
            status
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
