import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param
} from '@nestjs/common';
import { DeleteNfseUseCase } from '@/domain/dfe/nfse/use-cases/delete-nfse';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { Language } from '@/i18n';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('NFSe')
@Controller('/nfse/:id')
export class DeleteNfseController {
    constructor(private deleteNfse: DeleteNfseUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete NFSe', description: 'Delete an NFSe document by ID' })
    @ApiParam({ name: 'id', description: 'NFSe ID' })
    @ApiResponse({ status: 204, description: 'NFSe successfully deleted' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid parameters or business rules violation' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid authentication' })
    @ApiResponse({ status: 404, description: 'NFSe not found' })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') nfseId: string,
    ) {
        const businessId = user.bus;
        const language = 'pt-BR' as Language;

        const result = await this.deleteNfse.execute({
            businessId,
            nfseId,
        });

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            });
        }
    }
}