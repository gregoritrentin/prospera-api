import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditPersonUseCase } from 'edit-person.controller'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiParam } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editPersonBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string().toUpperCase(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
    cityCode: z.string(),
    status: z.string(),
    notes: z.string().optional(),
})

// Create DTO for Swagger documentation
class EditPersonRequestDto extends createZodDto(editPersonBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editPersonBodySchema)

type EditPersonBodySchema = z.infer<typeof editPersonBodySchema>

@ApiTags('Person')
@Controller('/person/:id')
@ApiSecurity('bearer')
export class EditPersonController {
    constructor(private editPerson: EditPersonUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Edit person',
        description: 'Updates an existing person record in the business'
    })
    @ApiParam({
        name: 'id',
        description: 'Person ID',
        type: 'string',
        required: true
    })
    @ApiBody({
        type: EditPersonRequestDto,
        description: 'Person update details',
        schema: {
            type: 'object',
            required: [
                'name',
                'email',
                'phone',
                'document',
                'addressLine1',
                'addressLine2',
                'addressLine3',
                'neighborhood',
                'postalCode',
                'countryCode',
                'stateCode',
                'cityCode',
                'status'
            ],
            properties: {
                name: {
                    type: 'string',
                    description: 'Full name of the person'
                },
                email: {
                    type: 'string',
                    description: 'Email address',
                    format: 'email'
                },
                phone: {
                    type: 'string',
                    description: 'Phone number'
                },
                document: {
                    type: 'string',
                    description: 'Identification document (will be converted to uppercase)'
                },
                addressLine1: {
                    type: 'string',
                    description: 'First line of address'
                },
                addressLine2: {
                    type: 'string',
                    description: 'Second line of address'
                },
                addressLine3: {
                    type: 'string',
                    description: 'Third line of address'
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
                    description: 'Person status'
                },
                notes: {
                    type: 'string',
                    description: 'Additional notes about the person'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Person updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data or unauthorized access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid person data or unauthorized access'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditPersonBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') personId: string,
    ) {
        const {
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
            notes
        } = body

        const businessId = user.bus

        const result = await this.editPerson.execute({
            businessId: businessId,
            personId: personId,
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
            notes,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}