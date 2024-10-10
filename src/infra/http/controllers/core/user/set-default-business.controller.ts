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
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import { SetDefaultBusinessUseCase } from '@/domain/application/use-cases/set-default-business'

const setDefaultBusinessBodySchema = z.object({

    defaultBusiness: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(setDefaultBusinessBodySchema)

type SetDefaultBusinessBodySchema = z.infer<typeof setDefaultBusinessBodySchema>

@Controller('/user/defaultbusiness/:id')
export class SetDefaultBusinessController {
    constructor(private setDefaultBusiness: SetDefaultBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: SetDefaultBusinessBodySchema,
        @Param('id') userId: string,
    ) {
        const {

            defaultBusiness,

        } = body

        const result = await this.setDefaultBusiness.execute({
            userId: userId,
            businessId: defaultBusiness,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
