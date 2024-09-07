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
import { EditBusinessOwnerUseCase } from '@/domain/core/use-cases/edit-business-owner'
import { Email } from '@/domain/email/entities/email'

const editBusinessOwnerBodySchema = z.object({

    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
    cityCode: z.string(),
    status: z.string(),
    ownerType: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(editBusinessOwnerBodySchema)

type EditBusinessOwnerBodySchema = z.infer<typeof editBusinessOwnerBodySchema>

@Controller('/business/owner/:id')
export class EditBusinessOwnerController {
    constructor(private editBusinessOwner: EditBusinessOwnerUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessOwnerBodySchema,
        @Param('id') businessOwnerId: string,
    ) {
        const {
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            ownerType,

        } = body

        const result = await this.editBusinessOwner.execute({
            businessOwnerId,
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            ownerType,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
