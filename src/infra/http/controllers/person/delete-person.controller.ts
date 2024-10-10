import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeletePersonUseCase } from '@/domain/person/use-cases/delete-person'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/person/:id')
export class DeletePersonController {
    constructor(private deletePerson: DeletePersonUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') personId: string,
    ) {
        const businessId = user.bus

        const result = await this.deletePerson.execute({
            businessId: businessId,
            personId: personId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
