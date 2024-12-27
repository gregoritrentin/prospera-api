import {
    Controller,
    Get,
    Param,
    Req,
    NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'
import { Language } from '@/i18n'
import { GetNfseUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse'
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@nestjs/swagger'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

const getNfseParamsSchema = z.object({
    id: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(getNfseParamsSchema)
type GetNfseParamsSchema = z.infer<typeof getNfseParamsSchema>

@ApiTags('NFSe')
@Controller('/nfse')
export class GetNfseController {
    constructor(private getNfse: GetNfseUseCase) { }

    @Get(':id')
    @ApiOperation({
        summary: 'Get NFSe details',
        description: 'Retrieve details of a specific NFSe. Requires Bearer Token authentication.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to en-US.',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] },
    })
    @ApiParam({
        name: 'id',
        description: 'NFSe ID',
        type: 'string',
        format: 'uuid'
    })
    @ApiResponse({ status: 200, description: 'NFSe details retrieved successfully' })
    @ApiResponse({ status: 404, description: 'NFSe not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Param(paramsValidationPipe) params: GetNfseParamsSchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language

        const result = await this.getNfse.execute({
            businessId: user.bus,
            nfseId: params.id
        }, language)

        if (result.isLeft()) {
            throw new NotFoundException(result.value)
        }

        return {
            nfse: result.value.nfse,
            message: result.value.message
        }
    }
}