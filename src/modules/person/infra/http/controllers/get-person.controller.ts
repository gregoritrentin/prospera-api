import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { GetPersonUseCase } from 'get-person.controller'
import { PersonPresenter } from '@/modules/person-presenter/infra/http/presenters/person-presenter.presenter'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Person')
@Controller('/person/:id')
@ApiSecurity('bearer')
export class GetPersonController {
    constructor(private getPerson: GetPersonUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get person',
        description: 'Retrieves a specific person record by ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Person ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Person retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Person ID'
                },
                name: {
                    type: 'string',
                    description: 'Full name'
                },
                email: {
                    type: 'string',
                    description: 'Email address'
                },
                phone: {
                    type: 'string',
                    description: 'Phone number'
                },
                document: {
                    type: 'string',
                    description: 'Identification document'
                },
                address: {
                    type: 'object',
                    properties: {
                        line1: {
                            type: 'string',
                            description: 'First line of address'
                        },
                        line2: {
                            type: 'string',
                            description: 'Second line of address'
                        },
                        line3: {
                            type: 'string',
                            description: 'Third line of address'
                        },
                        neighborhood: {
                            type: 'string',
                            description: 'Neighborhood'
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
                        }
                    }
                },
                status: {
                    type: 'string',
                    description: 'Person status'
                },
                notes: {
                    type: 'string',
                    description: 'Additional notes'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid person ID or unauthorized access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid person ID or unauthorized access'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') personId: string,
    ) {
        const businessId = user.bus

        const result = await this.getPerson.execute({
            businessId: businessId,
            personId: personId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const person = result.value.person

        return PersonPresenter.toHttp(person)
    }
}