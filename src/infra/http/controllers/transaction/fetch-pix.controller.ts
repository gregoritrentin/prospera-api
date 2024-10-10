import { BadRequestException, Get, Controller, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PixDetailsPresenter } from '@/infra/http/presenters/pix-details-presenter';
import { FetchPixUseCase } from '@/domain/transaction/use-cases/fetch-pixes';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { createZodDto } from 'nestjs-zod';

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

class PageQueryDto extends createZodDto(z.object({ page: pageQueryParamSchema })) { }

@ApiTags('Pix')
@ApiBearerAuth()
@Controller('/pix')
export class FetchPixController {
    constructor(private fetchPix: FetchPixUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Fetch Pixs', description: 'Retrieve a list of Pixs for the authenticated user' })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    })
    @ApiResponse({
        status: 200,
        description: 'List of Pixs retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                pixs: {
                    type: 'array',
                    items: {
                        type: 'object',
                        // Define the properties of a Pix here
                        // This should match the structure returned by PixDetailsPresenter.toHttp
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {
        const business = user.bus;
        const result = await this.fetchPix.execute({
            page,
            businessId: business,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const pixs = result.value.pixs;

        return { pixs: pixs.map(PixDetailsPresenter.toHttp) };
    }
}