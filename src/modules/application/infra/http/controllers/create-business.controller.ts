import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessUseCase } from 'create-business.controller'
import { Public } from '@/core/infra/auth/public'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createBusinessBodySchema = z.object({
  marketplaceId: z.string(),
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
  businessSize: z.string(),
  businessType: z.string(),
  foundingDate: z.string().transform((str) => new Date(str)),
  logoFileId: z.string().optional(),
  digitalCertificateFileId: z.string().optional(),
})

// Create DTO for Swagger documentation
class CreateBusinessRequest extends createZodDto(createBusinessBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createBusinessBodySchema)

type CreateBusinessBodySchema = z.infer<typeof createBusinessBodySchema>

@ApiTags('Business')
@Controller('/business')
export class CreateBusinessController {
  constructor(private createBusiness: CreateBusinessUseCase) { }

  @Post()
  @ApiOperation({
    summary: 'Create new business',
    description: 'Creates a new business with the provided details and associates it with the authenticated user'
  })
  @ApiBody({
    type: CreateBusinessRequest,
    description: 'Business details',
    schema: {
      type: 'object',
      required: [
        'marketplaceId', 'name', 'email', 'phone', 'document',
        'addressLine1', 'addressLine2', 'neighborhood', 'postalCode',
        'countryCode', 'stateCode', 'cityCode', 'businessSize',
        'businessType', 'foundingDate'
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
          description: 'Business contact email'
        },
        phone: {
          type: 'string',
          description: 'Business contact phone'
        },
        document: {
          type: 'string',
          description: 'Business registration document'
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
        logoFileId: {
          type: 'string',
          description: 'ID of the uploaded logo file',
          nullable: true
        },
        digitalCertificateFileId: {
          type: 'string',
          description: 'ID of the uploaded digital certificate file',
          nullable: true
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Business created successfully'
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
    @Body(bodyValidationPipe) body: CreateBusinessBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      marketplaceId,
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
      businessSize,
      businessType,
      foundingDate,
      logoFileId,
      digitalCertificateFileId
    } = body

    const result = await this.createBusiness.execute({
      marketplaceId,
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
      businessSize,
      businessType,
      foundingDate,
      logoFileId,
      digitalCertificateFileId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { message: 'Business created successfully' }
  }
}