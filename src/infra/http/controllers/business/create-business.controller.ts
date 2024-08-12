import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessUseCase } from '@/domain/business/use-cases/create-business'

const createBusinessBodySchema = z.object({
  marketplaceId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  document: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  neighborhood: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  state: z.string(),
  city: z.string(),
  businessSize: z.string(),
  businessType: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createBusinessBodySchema)

type CreateBusinessBodySchema = z.infer<typeof createBusinessBodySchema>

@Controller('/business')
export class CreateBusinessController {
  constructor(private createBusiness: CreateBusinessUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateBusinessBodySchema,
  ) {
    const {
      marketplaceId,
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
      state,
      city,
      businessSize,
      businessType,

    } = body

    const result = await this.createBusiness.execute({
      marketplaceId,
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
      state,
      city,
      businessSize,
      businessType,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
