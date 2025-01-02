import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { FetchDigitalCertificatesUseCase } from 'fetch-digital-certificate.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { createZodDto } from 'nestjs-zod'

// src/infra/http/controllers/digital-certificate/fetch-digital-certificates.controller.ts
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

class PageQueryDto extends createZodDto(z.object({ page: pageQueryParamSchema })) { }

@ApiTags('Digital Certificate')
@Controller('/digital-certificates')
export class FetchDigitalCertificatesController {
    constructor(private fetchCertificates: FetchDigitalCertificatesUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch Digital Certificates',
        description: 'List all digital certificates for the business'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    })
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.fetchCertificates.execute({
            page,
            businessId: user.bus,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return {
            certificates: result.value.certificates
        }
    }
}