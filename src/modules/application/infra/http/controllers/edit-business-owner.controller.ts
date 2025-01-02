import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditBusinessOwnerUseCase } from 'edit-business-owner.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editBusinessOwnerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
    cityCode: z.string(),
    status: z.string(),
    ownerType: z.string(),
})

// Create DTO for Swagger documentation
class EditBusinessOwnerRequest extends createZodDto(editBusinessOwnerBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editBusinessOwnerBodySchema)

type EditBusinessOwnerBodySchema = z.infer<typeof editBusinessOwnerBodySchema>

@ApiTags('Business Owners')
@Controller('/business/owner/:id')
export class EditBusinessOwnerController {
    constructor(private editBusinessOwner: EditBusinessOwnerUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update business owner',
        description: 'Updates the information of an existing business owner'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the business owner',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditBusinessOwnerRequest,
        description: 'Updated business owner details',
        schema: {
            type: 'object',
            required: [
                'name', 'email', 'phone', 'document', 'addressLine1',
                'addressLine2', 'neighborhood', 'postalCode', 'countryCode',
                'stateCode', 'cityCode', 'status', 'ownerType'
            ],
            properties: {
                name: {
                    type: 'string',
                    description: 'Full name of the owner'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Email address'
                },
                phone: {
                    type: 'string',
                    description: 'Contact phone number'
                },
                document: {
                    type: 'string',
                    description: 'Official identification document'
                },
                addressLine1: {
                    type: 'string',
                    description: 'Primary address line'
                },
                addressLine2: {
                    type: 'string',
                    description: 'Secondary address line'
                },
                addressLine3: {
                    type: 'string',
                    description: 'Additional address information',
                    nullable: true
                },
                neighborhood: {
                    type: 'string',
                    description: 'Neighborhood name'
                },
                postalCode: {
                    type: 'string',
                    description: 'Postal/ZIP code'
                },
                countryCode: {
                    type: 'string',
                    description: 'Country code'
                },
                stateCode: {
                    type: 'string',
                    description: 'State/Province code'
                },
                cityCode: {
                    type: 'string',
                    description: 'City code'
                },
                status: {
                    type: 'string',
                    description: 'Current status of the owner'
                },
                ownerType: {
                    type: 'string',
                    description: 'Type of ownership'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Business owner updated successfully'
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
                    example: 'Invalid owner data'
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
        description: 'Business owner not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Business owner not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessOwnerBodySchema,
        @Param('id') businessOwnerId: string,
    ) {
        const {
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            ownerType,
        } = body

        const result = await this.editBusinessOwner.execute({
            businessOwnerId,
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            ownerType,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}