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
import { EditUserUseCase } from '@/domain/user/use-cases/edit-user'

const editUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    defaultBusiness: z.string().optional(),
    photoFileId: z.string().optional(),
    status: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/user/:id')
export class EditUserController {
    constructor(private editUser: EditUserUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditUserBodySchema,
        @Param('id') userId: string,
    ) {
        const {
            name,
            email,
            password,
            defaultBusiness,
            photoFileId,
            status,

        } = body

        const result = await this.editUser.execute({
            userId: userId,
            name,
            email,
            password,
            defaultBusiness,
            photoFileId,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
