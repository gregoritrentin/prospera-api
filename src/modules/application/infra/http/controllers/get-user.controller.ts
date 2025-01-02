import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { UserDetailsPresenter } from '@/modules/user-details-presenter/infra/http/presenters/user-details-presenter.presenter'
import { GetUserUseCase } from 'get-user.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('/user/me')
@ApiSecurity('bearer')
export class GetUserController {
    constructor(private getUser: GetUserUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get current user details',
        description: 'Retrieves detailed information about the currently authenticated user'
    })
    @ApiResponse({
        status: 200,
        description: 'User details retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'User ID'
                },
                name: {
                    type: 'string',
                    description: 'User full name'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email address'
                }
                // Add other user properties as needed
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
                    example: 'Invalid user data'
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
        const result = await this.getUser.execute({
            userId: userPayload.sub,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const user = result.value.user

        return UserDetailsPresenter.toHttp(user)
    }
}