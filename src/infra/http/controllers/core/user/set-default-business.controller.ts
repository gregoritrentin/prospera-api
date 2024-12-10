import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import { SetDefaultBusinessUseCase } from '@/domain/application/use-cases/set-default-business'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiParam } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const setDefaultBusinessBodySchema = z.object({
    defaultBusiness: z.string(),
})

class SetDefaultBusinessRequest extends createZodDto(setDefaultBusinessBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(setDefaultBusinessBodySchema)

type SetDefaultBusinessBodySchema = z.infer<typeof setDefaultBusinessBodySchema>

@ApiTags('Users')
@Controller('/user/defaultbusiness/:id')
@ApiSecurity('bearer')
export class SetDefaultBusinessController {
    constructor(private setDefaultBusiness: SetDefaultBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Set default business for user',
        description: 'Updates the default business association for a specific user'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'User ID',
        format: 'uuid'
    })
    @ApiBody({
        type: SetDefaultBusinessRequest,
        description: 'Default business details',
        schema: {
            type: 'object',
            required: ['defaultBusiness'],
            properties: {
                defaultBusiness: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the business to set as default'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Default business updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid business data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: SetDefaultBusinessBodySchema,
        @Param('id') userId: string,
    ) {
        const { defaultBusiness } = body

        const result = await this.setDefaultBusiness.execute({
            userId: userId,
            businessId: defaultBusiness,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}