import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessOwnerUseCase } from '@/domain/application/use-cases/create-business-owner'

const createBusinessOwnerBodySchema = z.object({
    businessId: z.string(),
    name: z.string(),
    email: z.string(),
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
    birthDate: z.string().transform((str) => new Date(str)),
    status: z.string(),
    ownerType: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createBusinessOwnerBodySchema)

type CreateBusinessOwnerBodySchema = z.infer<typeof createBusinessOwnerBodySchema>

@Controller('/business/owner')
export class CreateBusinessOwnerController {
    constructor(private createBusinessOwner: CreateBusinessOwnerUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateBusinessOwnerBodySchema,
    ) {
        const {
            businessId,
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            birthDate,
            status,
            ownerType,

        } = body

        const result = await this.createBusinessOwner.execute({
            businessId,
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            birthDate,
            ownerType,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
