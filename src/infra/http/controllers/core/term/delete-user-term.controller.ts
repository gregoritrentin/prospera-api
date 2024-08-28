import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteUserTermUseCase } from '@/domain/core/use-cases/delete-user-term'

@Controller('/user/term/:id')
export class DeleteUserTermController {
    constructor(private deleteTerm: DeleteUserTermUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(

        @Param('id') userTermId: string,
    ) {

        const result = await this.deleteTerm.execute({
            userTermId: userTermId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
