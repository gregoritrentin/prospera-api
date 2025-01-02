import {
    BadRequestException,
    Controller,
    Get,
    Param,
} from '@nestjs/common'
import { FetchBusinessOwnerUseCase } from '@/modules/application/domain/use-cases/fetch-user-owner'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { BusinessOwnerPresenter } from '@/modules/business-owner-presenter/infra/http/presenters/business-owner-presenter.presenter'

@ApiTags('Business Owners')
@Controller('/business/owner/:id')
export class FetchBusinessOwnerController {
    constructor(private fetchBusinessOwner: FetchBusinessOwnerUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch business owner',
        description: 'Retrieves the owner details for a specific business'
    })
    @ApiParam({
        name: 'id',
        description: 'Business ID to fetch owner from',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Business owner retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                businessOwner: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Owner ID'
                        },
                        businessId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Associated business ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Owner name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Owner email'
                        },
                        phone: {
                            type: 'string',
                            description: 'Contact phone'
                        },
                        document: {
                            type: 'string',
                            description: 'Identification document'
                        },
                        addressLine1: {
                            type: 'string',
                            description: 'Primary address'
                        },
                        addressLine2: {
                            type: 'string',
                            description: 'Secondary address'
                        },
                        addressLine3: {
                            type: 'string',
                            description: 'Additional address info',
                            nullable: true
                        },
                        neighborhood: {
                            type: 'string',
                            description: 'Neighborhood'
                        },
                        postalCode: {
                            type: 'string',
                            description: 'Postal code'
                        },
                        countryCode: {
                            type: 'string',
                            description: 'Country code'
                        },
                        stateCode: {
                            type: 'string',
                            description: 'State code'
                        },
                        cityCode: {
                            type: 'string',
                            description: 'City code'
                        },
                        status: {
                            type: 'string',
                            description: 'Owner status'
                        },
                        ownerType: {
                            type: 'string',
                            description: 'Type of ownership'
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
    async handle(@Param('id') businessId: string) {
        const result = await this.fetchBusinessOwner.execute({
            businessId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const businessOwner = result.value.businessOwner[0]

        return { businessOwner: BusinessOwnerPresenter.toHttp(businessOwner) }
    }
}