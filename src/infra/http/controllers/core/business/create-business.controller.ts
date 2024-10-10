import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessUseCase } from '@/domain/application/use-cases/create-business'
import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createBusinessBodySchema = z.object({
  marketplaceId: z.string(),
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
  businessSize: z.string(),
  businessType: z.string(),
  foundingDate: z.string().transform((str) => new Date(str)),
  logoFileId: z.string().optional(),
  digitalCertificateFileId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createBusinessBodySchema)

type CreateBusinessBodySchema = z.infer<typeof createBusinessBodySchema>

@Controller('/business')
export class CreateBusinessController {
  constructor(private createBusiness: CreateBusinessUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateBusinessBodySchema,
    @CurrentUser() user: UserPayload,

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
      stateCode,
      cityCode,
      businessSize,
      businessType,
      foundingDate,
      logoFileId,
      digitalCertificateFileId

    } = body

    const userId = user.sub

    console.log(userId)

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
      stateCode,
      cityCode,
      businessSize,
      businessType,
      foundingDate,
      logoFileId,
      digitalCertificateFileId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
