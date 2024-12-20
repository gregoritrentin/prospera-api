import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditItemTaxationUseCase } from '@/domain/item/use-cases/edit-item-taxation'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editItemTaxationBodySchema = z.object({
    taxation: z.string(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditItemTaxationRequestDto extends createZodDto(editItemTaxationBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editItemTaxationBodySchema)

type EditItemTaxationBodySchema = z.infer<typeof editItemTaxationBodySchema>

@ApiTags('Items')
@Controller('/itemtaxation/:id')
@ApiSecurity('bearer')
export class EditItemTaxationController {
    constructor(private editItemTaxation: EditItemTaxationUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Edit item taxation',
        description: 'Updates an existing item taxation type in the business'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item taxation ID',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditItemTaxationRequestDto,
        description: 'Item taxation update details',
        schema: {
            type: 'object',
            required: ['taxation', 'status'],
            properties: {
                taxation: {
                    type: 'string',
                    description: 'Updated taxation type name',
                    example: 'ICMS'
                },
                status: {
                    type: 'string',
                    description: 'Updated taxation status',
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Item taxation updated successfully'
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
                    example: 'Invalid taxation data'
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
        description: 'Item taxation not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Item taxation not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditItemTaxationBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') taxationId: string,
    ) {
        const {
            taxation,
            status,
        } = body

        const businessId = user.bus

        const result = await this.editItemTaxation.execute({
            businessId: businessId,
            taxationId: taxationId,
            taxation: taxation,
            status: status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}