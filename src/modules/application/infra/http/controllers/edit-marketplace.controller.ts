import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditMarketplaceUseCase } from 'edit-marketplace.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editMarketplaceBodySchema = z.object({
    name: z.string(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditMarketplaceRequest extends createZodDto(editMarketplaceBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editMarketplaceBodySchema)

type EditMarketplaceBodySchema = z.infer<typeof editMarketplaceBodySchema>

@ApiTags('Marketplaces')
@Controller('/marketplace/:id')
export class EditMarketplaceController {
    constructor(private editMarketplace: EditMarketplaceUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update marketplace',
        description: 'Updates an existing marketplace name and status'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the marketplace',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditMarketplaceRequest,
        description: 'Updated marketplace details',
        schema: {
            type: 'object',
            required: ['name', 'status'],
            properties: {
                name: {
                    type: 'string',
                    description: 'New marketplace name'
                },
                status: {
                    type: 'string',
                    description: 'New marketplace status',
                    enum: ['PENDING', 'ACTIVE', 'INACTIVE']
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Marketplace updated successfully'
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
                    example: 'Invalid marketplace data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Marketplace not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Marketplace not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditMarketplaceBodySchema,
        @Param('id') marketplaceId: string,
    ) {
        const {
            name,
            status
        } = body

        const result = await this.editMarketplace.execute({
            marketplaceId,
            name,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}