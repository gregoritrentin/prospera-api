import { BadRequestException, Controller, Patch, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { ActivateDigitalCertificateUseCase } from 'activate-digital-certificate.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'

// src/infra/http/controllers/digital-certificate/activate-digital-certificate.controller.ts
@ApiTags('Digital Certificate')
@Controller('/digital-certificates/:id/activate')
export class ActivateDigitalCertificateController {
    constructor(private activateDigitalCertificate: ActivateDigitalCertificateUseCase) { }

    @Patch()
    @ApiOperation({
        summary: 'Activate Digital Certificate',
        description: 'Activate a specific digital certificate'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiResponse({ status: 200, description: 'Certificate activated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Param('id') certificateId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.activateDigitalCertificate.execute({
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