import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { UserDetailsPresenter } from '@/infra/http/presenters/user-details-presenter'
import { GetUserUseCase } from '@/domain/user/use-cases/get-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
@Controller('/user/me')
export class GetUserController {
    constructor(private getUser: GetUserUseCase) { }

    @Get()
    async handle(
        @CurrentUser() userPayload: UserPayload,

    ) {

        const result = await this.getUser.execute({
            userId: userPayload.sub,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const user = result.value.user

        return UserDetailsPresenter.toHttp(user)
    }
}
