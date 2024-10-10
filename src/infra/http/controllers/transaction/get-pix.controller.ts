import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetPixUseCase } from '@/domain/transaction/use-cases/get-pix';
import { PixPresenter } from '@/infra/http/presenters/pix-presenter';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const getPixParamSchema = z.object({
    id: z.string().uuid(),
});

class GetPixParam extends createZodDto(getPixParamSchema) { }

@ApiTags('Pix')
@ApiBearerAuth()
@Controller('/pix/:id')
export class GetPixController {
    constructor(private getPix: GetPixUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Get Pix', description: 'Retrieve a specific Pix by its ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'Pix ID' })
    @ApiResponse({
        status: 200,
        description: 'Pix retrieved successfully',
        // You might want to create a specific DTO for the response
        // type: PixResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param(new ZodValidationPipe(getPixParamSchema)) params: GetPixParam,
    ) {
        const businessId = user.bus;

        const result = await this.getPix.execute({
            businessId: businessId,
            pixId: params.id,
        });

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException(error.message);
        }

        const pix = result.value.pix;

        return PixPresenter.toHttp(pix);
    }
}