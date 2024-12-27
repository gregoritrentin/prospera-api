import { BadRequestException, Get, Controller } from '@nestjs/common'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BusinessPresenter } from '@/infra/http/presenters/business-presenter'
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Business')
@Controller('/business/me')
@ApiSecurity('bearer')
export class GetBusinessController {
    constructor(private getBusiness: GetBusinessUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get current user business',
        description: 'Retrieves the business information for the currently authenticated user'
    })
    @ApiResponse({
        status: 200,
        description: 'Business information retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                business: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Business ID'
                            },
                            name: {
                                type: 'string',
                                description: 'Business name'
                            }
                            // Add other business properties as needed
                        }
                    }
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
        @CurrentUser() userPayload: UserPayload,
    ) {
        const result = await this.getBusiness.execute({
            businessId: userPayload.bus,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const business = result.value.business

        return { business: business.map(BusinessPresenter.toHttp) }
    }
}