import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CreatePersonUseCase } from '@/domain/person/use-cases/create-person'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createPersonBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  document: z.string().toUpperCase(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  neighborhood: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  stateCode: z.string(),
  cityCode: z.string(),
  notes: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createPersonBodySchema)

type CreatePersonBodySchema = z.infer<typeof createPersonBodySchema>

@Controller('/person')
export class CreatePersonController {
  constructor(private createPerson: CreatePersonUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreatePersonBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
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
      notes
    } = body

    const business = user.bus

    const result = await this.createPerson.execute({
      businessId: business,
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
      status: 'ACTIVE',
      notes
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}



