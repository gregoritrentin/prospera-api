import {
    BadRequestException,
    Controller,
    Param,
} from '@nestjs/common'
import { FetchBusinessOwnerUseCase } from '@/domain/core/use-cases/fetch-user-owner'

@Controller('/business/owner/:id')
export class FetchBusinessOwnerController {
    constructor(private fetchBusinessOwner: FetchBusinessOwnerUseCase) { }

    async handle(
        @Param('id') businessId: string,
    ) {
        const result = await this.fetchBusinessOwner.execute({
            businessId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
