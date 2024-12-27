import {
    BadRequestException,
    Controller,
    Get,
    Param,
} from '@nestjs/common'
import { FetchBusinessAppUseCase } from '@/domain/application/use-cases/fetch-business-apps'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { BusinessAppPresenter } from '@/infra/http/presenters/business-app-presenter'

@ApiTags('Business Applications')
@Controller('/business/app/:id')
export class FetchBusinessAppController {
    constructor(private fetchBusinessApp: FetchBusinessAppUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch business applications',
        description: 'Retrieves all applications associated with a business'
    })
    @ApiParam({
        name: 'id',
        description: 'Business ID to fetch applications from',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Business applications retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                businessApp: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Business app association ID'
                            },
                            businessId: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Business ID'
                            },
                            appId: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Application ID'
                            },
                            quantity: {
                                type: 'number',
                                description: 'Quantity of applications',
                                minimum: 0
                            },
                            price: {
                                type: 'number',
                                description: 'Price per application',
                                minimum: 0
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Creation timestamp'
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Last update timestamp'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid business ID',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid business ID'
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
    async handle(@Param('id') businessId: string) {
        const result = await this.fetchBusinessApp.execute({
            businessId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const businessApp = result.value.businessApp

        return { businessApp: businessApp.map(app => BusinessAppPresenter.toHttp(app as any)) }
    }
}