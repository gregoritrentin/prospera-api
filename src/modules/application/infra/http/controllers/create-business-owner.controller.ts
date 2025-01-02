import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessOwnerUseCase } from 'create-business-owner.controller'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createBusinessOwnerBodySchema = z.object({
    businessId: z.string(),
    name: z.string(),
    email: z.string(),
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
    birthDate: z.string().transform((str) => new Date(str)),
    status: z.string(),
    ownerType: z.string(),
})

// Create DTO for Swagger documentation
class CreateBusinessOwnerRequest extends createZodDto(createBusinessOwnerBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createBusinessOwnerBodySchema)

type CreateBusinessOwnerBodySchema = z.infer<typeof createBusinessOwnerBodySchema>

@ApiTags('Business Owners')
@Controller('/business/owner')
export class CreateBusinessOwnerController {
    constructor(private createBusinessOwner: CreateBusinessOwnerUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Create business owner',
        description: 'Creates a new owner for an existing business with personal and address information'
    })
    @ApiBody({
        type: CreateBusinessOwnerRequest,
        description: 'Business owner details',
        schema: {
            type: 'object',
            required: [
                'businessId', 'name', 'email', 'phone', 'document',
                'addressLine1', 'addressLine2', 'neighborhood', 'postalCode',
                'countryCode', 'stateCode', 'cityCode', 'birthDate',
                'status', 'ownerType'
            ],
            properties: {
                businessId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the associated business'
                },
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
                birthDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Date of birth (YYYY-MM-DD)'
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
        status: 201,
        description: 'Business owner created successfully'
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
                    example: 'Invalid business ID or owner data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateBusinessOwnerBodySchema,
    ) {
        const {
            businessId,
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            birthDate,
            status,
            ownerType,
        } = body

        const result = await this.createBusinessOwner.execute({
            businessId,
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            birthDate,
            ownerType,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return { message: 'Business owner created successfully' }
    }
}