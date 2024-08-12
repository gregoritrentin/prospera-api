import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteAppUseCase } from '@/domain/app/use-cases/delete-app'


@Controller('/app/:id')
export class DeleteAppController {
    constructor(private deleteApp: DeleteAppUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(

        @Param('id') appId: string,
    ) {

        const result = await this.deleteApp.execute({
            appId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

    }

}
