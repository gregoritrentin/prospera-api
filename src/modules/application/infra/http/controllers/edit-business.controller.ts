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
import { EditBusinessUseCase } from 'edit-business.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editBusinessBodySchema = z.object({
    marketplaceId: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    ie: z.string(),
    im: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
    cityCode: z.string(),
    businessSize: z.string(),
    businessType: z.string(),
    foundingDate: z.string().transform((str) => new Date(str)),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditBusinessRequest extends createZodDto(editBusinessBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editBusinessBodySchema)

type EditBusinessBodySchema = z.infer<typeof editBusinessBodySchema>

@ApiTags('Business')
@Controller('/business/:id')
export class EditBusinessController {
    constructor(private editBusiness: EditBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update business',
        description: 'Updates the information of an existing business'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the business',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditBusinessRequest,
        description: 'Updated business details',
        schema: {
            type: 'object',
            required: [
                'marketplaceId', 'name', 'email', 'phone', 'document',
                'ie', 'im', 'addressLine1', 'addressLine2', 'neighborhood',
                'postalCode', 'countryCode', 'stateCode', 'cityCode',
                'businessSize', 'businessType', 'foundingDate', 'status'
            ],
            properties: {
                marketplaceId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the marketplace'
                },
                name: {
                    type: 'string',
                    description: 'Business name'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Business email address'
                },
                phone: {
                    type: 'string',
                    description: 'Business phone number'
                },
                document: {
                    type: 'string',
                    description: 'Business registration document'
                },
                ie: {
                    type: 'string',
                    description: 'State registration number'
                },
                im: {
                    type: 'string',
                    description: 'Municipal registration number'
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
                businessSize: {
                    type: 'string',
                    description: 'Size of the business'
                },
                businessType: {
                    type: 'string',
                    description: 'Type of business'
                },
                foundingDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Business founding date (YYYY-MM-DD)'
                },
                status: {
                    type: 'string',
                    description: 'Current status of the business'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Business updated successfully'
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
    @ApiResponse({
        status: 404,
        description: 'Business not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Business not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessBodySchema,
        @Param('id') businessId: string,
    ) {
        const {
            marketplaceId,
            name,
            email,
            phone,
            document,
            ie,
            im,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            businessSize,
            businessType,
            foundingDate,
            status
        } = body

        const result = await this.editBusiness.execute({
            businessId,
            marketplaceId,
            name,
            email,
            phone,
            document,
            ie,
            im,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            businessSize,
            businessType,
            foundingDate,
            status
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}