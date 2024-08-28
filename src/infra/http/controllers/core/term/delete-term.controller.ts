import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteTermUseCase } from '@/domain/core/use-cases/delete-term'

@Controller('/term/:id')
export class DeleteTermController {
    constructor(private deleteTerm: DeleteTermUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(

        @Param('id') termId: string,
    ) {

        const result = await this.deleteTerm.execute({
            termId: termId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
