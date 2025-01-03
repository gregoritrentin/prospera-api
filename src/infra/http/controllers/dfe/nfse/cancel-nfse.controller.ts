// src/infra/http/controllers/nfse/fetch-nfses.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { FetchNfsesUseCase } from '@/domain/dfe/nfse/use-cases/fetch-nfses';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const fetchNfsesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
});

class FetchNfsesQuery extends createZodDto(fetchNfsesQuerySchema) { }

const queryValidationPipe = new ZodValidationPipe(fetchNfsesQuerySchema);
type FetchNfsesQuerySchema = z.infer<typeof fetchNfsesQuerySchema>;

@ApiTags('NFSe')
@Controller('/nfse')
export class FetchNfsesController {
    constructor(private fetchNfses: FetchNfsesUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch NFSe list',
        description: 'Get a paginated list of NFSe. Optionally filter by date range.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number (starts at 1)',
        type: Number
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Start date for filtering (ISO format)',
        type: String
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'End date for filtering (ISO format)',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'NFSe list retrieved successfully'
    })
    async handle(
        @Query(queryValidationPipe) query: FetchNfsesQuerySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.fetchNfses.execute({
            page: query.page,
            businessId: user.bus,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined
        });

        return result.value;
    }
}