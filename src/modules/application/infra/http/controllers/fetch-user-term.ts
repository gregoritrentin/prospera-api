import {
    BadRequestException,
    Controller,
    Get,
    Param,
} from '@nestjs/common'
import { FetchUserTermUseCase } from '@/domain/application/use-cases/fetch-user-terms'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { UserTermPresenter } from '@/infra/http/presenters/user-term-presenter'

@ApiTags('Terms')
@Controller('/user/term/:id')
export class FetchUserTermController {
    constructor(private fetchUserTerm: FetchUserTermUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch user terms',
        description: 'Retrieves all terms accepted by a specific user'
    })
    @ApiParam({
        name: 'id',
        description: 'User ID to fetch term acceptances',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'User terms retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                userTerms: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'User term acceptance ID'
                            },
                            userId: {
                                type: 'string',
                                format: 'uuid',
                                description: 'User ID'
                            },
                            termId: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Term ID'
                            },
                            ip: {
                                type: 'string',
                                description: 'IP address during acceptance'
                            },
                            acceptedAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Acceptance timestamp'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid user ID'
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async handle(@Param('id') userId: string) {
        const result = await this.fetchUserTerm.execute({
            userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const userTerms = result.value.userTerm

        return { userTerms: userTerms?.map(UserTermPresenter.toHttp) ?? [] }
    }
}