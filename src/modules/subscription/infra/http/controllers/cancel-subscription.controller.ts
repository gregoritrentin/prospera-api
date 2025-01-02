import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Headers,
    Post,
} from '@nestjs/common'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { CancelSubscriptionUseCase } from 'cancel-subscription.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger'

@ApiTags('Subscription')
@Controller('/subscriptions/cancel/:id')
export class CancelSubscriptionController {
    constructor(private cancelSubscription: CancelSubscriptionUseCase) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({
        summary: 'Cancel Subscription',
        description: 'Cancel a specific subscription by its ID'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to en-US.',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] },
    })
    @ApiParam({ name: 'id', type: 'string', description: 'Subscription ID' })
    @ApiResponse({
        status: 200,
        description: 'Subscription cancelled successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Operation not allowed, invalid status transition or subscription not found',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                details: { type: 'object' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') subscriptionId: string,
        @Headers('Accept-Language') language: string = 'en-US',
    ) {
        const result = await this.cancelSubscription.execute(
            {
                businessId: user.bus,
                subscriptionId,
            },
            language as 'en-US' | 'pt-BR'
        )

        if (result.isLeft()) {
            const error = result.value
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            })
        }

        return {
            message: result.value.message,
        }
    }
}