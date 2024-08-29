import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateUserTermUseCase } from '@/domain/core/use-cases/create-user-term'

const createUserTermBodySchema = z.object({
    termId: z.string(),
    userId: z.string(),
    ip: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(createUserTermBodySchema)

type CreateUserTermBodySchema = z.infer<typeof createUserTermBodySchema>

@Controller('/user/term')
export class CreateUserTermController {
    constructor(private createUserTerm: CreateUserTermUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateUserTermBodySchema,
    ) {
        const {
            termId,
            userId,
            ip,
        } = body

        const result = await this.createUserTerm.execute({

            userId,
            ip,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}
