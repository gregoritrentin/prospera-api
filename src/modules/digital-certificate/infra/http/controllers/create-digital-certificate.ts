// src/infra/http/controllers/digital-certificate/create-digital-certificate.controller.ts
import { BadRequestException, Body, Controller, HttpCode, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateDigitalCertificateUseCase } from '@/domain/digital-certificate/use-cases/create-digital-certificate'
import { Language } from '@/i18n'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createDigitalCertificateBodySchema = z.object({
    certificateFile: z.instanceof(Buffer),
    password: z.string(),
})

class CertificateRequest extends createZodDto(createDigitalCertificateBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createDigitalCertificateBodySchema)
type CreateDigitalCertificateBodySchema = z.infer<typeof createDigitalCertificateBodySchema>

@ApiTags('Digital Certificate')
@Controller('/digital-certificates')
export class CreateDigitalCertificateController {
    constructor(private createDigitalCertificate: CreateDigitalCertificateUseCase) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Upload a new Digital Certificate',
        description: 'Upload a PFX/P12 certificate file with its password. The system will extract the necessary information.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response.',
        required: false,
        schema: { type: 'string', default: 'pt-BR', enum: ['en-US', 'pt-BR'] },
    })
    @ApiBody({ type: CertificateRequest })
    @ApiResponse({ status: 201, description: 'Certificate created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async handle(
        @Body(bodyValidationPipe) body: CreateDigitalCertificateBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'pt-BR') as Language

        const result = await this.createDigitalCertificate.execute({
            businessId: user.bus,
            certificateFile: body.certificateFile,
            password: body.password,
        }, language)

        if (result.isLeft()) {
            const error = result.value
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            })
        }

        return {
            certificate: result.value.certificate,
            message: result.value.message,
        }
    }
}