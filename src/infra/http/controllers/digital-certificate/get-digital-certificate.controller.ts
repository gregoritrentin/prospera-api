// src/infra/http/controllers/digital-certificate/get-digital-certificate.controller.ts
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { GetDigitalCertificateUseCase } from '@/domain/digital-certificate/use-cases/get-digital-certificate'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('Digital Certificate')
@Controller('/digital-certificates/:id')
export class GetDigitalCertificateController {
    constructor(private getDigitalCertificate: GetDigitalCertificateUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get Digital Certificate',
        description: 'Get a specific digital certificate by ID'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiResponse({ status: 200, description: 'Certificate retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Param('id') certificateId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.getDigitalCertificate.execute({
            certificateId,
            businessId: user.bus,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return {
            certificate: result.value.certificate,
            message: result.value.message,
        }
    }
}