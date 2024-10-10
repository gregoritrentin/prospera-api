import {
    BadRequestException,
    Controller,
    Param,
} from '@nestjs/common'
import { FetchBusinessAppUseCase } from '@/domain/application/use-cases/fetch-business-apps'

@Controller('/business/app/:id')
export class FetchBusinessAppController {
    constructor(private fetchBusinessApp: FetchBusinessAppUseCase) { }

    async handle(
        @Param('id') businessId: string,
    ) {
        const result = await this.fetchBusinessApp.execute({
            businessId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
