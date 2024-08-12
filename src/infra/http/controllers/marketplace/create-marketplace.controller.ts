import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateMarketplaceUseCase } from '@/domain/business/use-cases/create-marketplace'

const createMarketplaceBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createMarketplaceBodySchema)

type CreateMarketplaceBodySchema = z.infer<typeof createMarketplaceBodySchema>

@Controller('/marketplaces')
export class CreateMarketplaceController {
  constructor(private createMarketplace: CreateMarketplaceUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateMarketplaceBodySchema,
  ) {
    const {
      name,
    } = body

    const result = await this.createMarketplace.execute({
      name,
      status: 'PENDING'

    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}
