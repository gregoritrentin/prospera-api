import { BadRequestException, Get, Controller } from '@nestjs/common'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BusinessPresenter } from '@/infra/http/presenters/business-presenter'



@Controller('/business/me')
export class GetBusinessController {
    constructor(private getBusiness: GetBusinessUseCase) { }

    @Get()
    async handle(
        @CurrentUser() userPayload: UserPayload,

    ) {

        const result = await this.getBusiness.execute({
            businessId: userPayload.bus,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const business = result.value.business

        return { business: business.map(BusinessPresenter.toHttp) }
    }
}
