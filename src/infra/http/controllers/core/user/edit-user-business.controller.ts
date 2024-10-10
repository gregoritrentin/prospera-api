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
import { EditUserBusinessUseCase } from '@/domain/application/use-cases/edit-user-business'

const editUserBusinessBodySchema = z.object({
    role: z.string(),
    isDefaultBusiness: z.boolean(),
    status: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editUserBusinessBodySchema)

type EditUserBusinessBodySchema = z.infer<typeof editUserBusinessBodySchema>

@Controller('/user/business/:id')
export class EditUserBusinessController {
    constructor(private editUser: EditUserBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditUserBusinessBodySchema,
        @Param('id') userBusinessId: string,
    ) {
        const {
            role,
            status,

        } = body

        const result = await this.editUser.execute({
            userbusinessId: userBusinessId,
            role,
            status,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
