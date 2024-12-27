import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateMarketplaceUseCase } from '@/domain/application/use-cases/create-marketplace'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createMarketplaceBodySchema = z.object({
  name: z.string(),
  document: z.string(),
})

// Create DTO for Swagger documentation
class CreateMarketplaceRequest extends createZodDto(createMarketplaceBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createMarketplaceBodySchema)

type CreateMarketplaceBodySchema = z.infer<typeof createMarketplaceBodySchema>

@ApiTags('Marketplaces')
@Controller('/marketplaces')
export class CreateMarketplaceController {
  constructor(private createMarketplace: CreateMarketplaceUseCase) { }

  @Post()
  @ApiOperation({
    summary: 'Create marketplace',
    description: 'Creates a new marketplace with pending status'
  })
  @ApiBody({
    type: CreateMarketplaceRequest,
    description: 'Marketplace details',
    schema: {
      type: 'object',
      required: ['name', 'document'],
      properties: {
        name: {
          type: 'string',
          description: 'Marketplace name'
        },
        document: {
          type: 'string',
          description: 'Marketplace document/registration number'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Marketplace created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Marketplace created successfully'
        }
      }
    }
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
  async handle(
    @Body(bodyValidationPipe) body: CreateMarketplaceBodySchema,
  ) {
    const {
      name,
      document,
    } = body

    const result = await this.createMarketplace.execute({
      name,
      document,
      status: 'PENDING'
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { message: 'Marketplace created successfully' }
  }
}