import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditMarketplaceUseCase } from '@/domain/core/use-cases/edit-marketplace'

const editMarketplaceBodySchema = z.object({
    name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editMarketplaceBodySchema)

type EditMarketplaceBodySchema = z.infer<typeof editMarketplaceBodySchema>

@Controller('/marketplace/:id')
export class EditMarketplaceController {
    constructor(private editMarketplace: EditMarketplaceUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditMarketplaceBodySchema,
        @Param('id') marketplaceId: string,
    ) {
        const {
            name,

        } = body

        const result = await this.editMarketplace.execute({
            marketplaceId,
            name,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}