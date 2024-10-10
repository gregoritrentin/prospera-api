import {
    BadRequestException,
    Controller,
    Param,
} from '@nestjs/common'
import { FetchUserTermUseCase } from '@/domain/application/use-cases/fetch-user-terms'

@Controller('/user/term/:id')
export class FetchUserTermController {
    constructor(private fetchBusinessApp: FetchUserTermUseCase) { }

    async handle(
        @Param('id') userId: string,
    ) {
        const result = await this.fetchBusinessApp.execute({
            userId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
