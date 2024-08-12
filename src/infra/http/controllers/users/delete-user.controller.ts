import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteUserUseCase } from '@/domain/user/use-cases/delete-user'

@Controller('/user/:id')
export class DeleteUserController {
    constructor(private deleteUser: DeleteUserUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(

        @Param('id') userId: string,
    ) {

        const result = await this.deleteUser.execute({
            userId: userId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
