import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { GetPersonUseCase } from '@/domain/person/use-cases/get-person'
import { PersonPresenter } from '@/infra/http/presenters/person-presenter'

@Controller('/person/:id')
export class GetPersonController {
    constructor(private getPerson: GetPersonUseCase) { }

    @Get()
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') personId: string,
    ) {

        const businessId = user.bus

        const result = await this.getPerson.execute({
            businessId: businessId,
            personId: personId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const person = result.value.person

        return PersonPresenter.toHttp(person)
    }
}
