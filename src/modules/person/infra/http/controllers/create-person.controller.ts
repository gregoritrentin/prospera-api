import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { CreatePersonUseCase } from 'create-person.controller'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createPersonBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  document: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  neighborhood: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  stateCode: z.string(),
  cityCode: z.string(),
  notes: z.string(),
})

// Create DTO for Swagger documentation
class CreatePersonRequestDto extends createZodDto(createPersonBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createPersonBodySchema)

type CreatePersonBodySchema = z.infer<typeof createPersonBodySchema>

@ApiTags('Person')
@Controller('/person')
@ApiSecurity('bearer')
export class CreatePersonController {
  constructor(private createPerson: CreatePersonUseCase) { }

  @Post()
  @ApiOperation({
    summary: 'Create person',
    description: 'Creates a new person record for the business'
  })
  @ApiBody({
    type: CreatePersonRequestDto,
    description: 'Person creation details',
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
        'notes'
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
          description: 'Identification document'
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
        notes: {
          type: 'string',
          description: 'Additional notes about the person'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Person created successfully'
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
          example: 'Invalid person data'
        },
        statusCode: {
          type: 'number',
          example: 400
        }
      }
    }
  })
  async handle(
    @Body(bodyValidationPipe) body: CreatePersonBodySchema,
    @CurrentUser() user: UserPayload,
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
      notes
    } = body

    const business = user.bus

    const result = await this.createPerson.execute({
      businessId: business,
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
      status: 'ACTIVE',
      notes
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}