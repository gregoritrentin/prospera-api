import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditPersonUseCase } from '@/domain/person/use-cases/edit-person'

const editPersonBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string().toUpperCase(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
    cityCode: z.string(),
    status: z.string(),
    notes: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editPersonBodySchema)

type EditPersonBodySchema = z.infer<typeof editPersonBodySchema>

@Controller('/person/:id')
export class EditPersonController {
    constructor(private editPerson: EditPersonUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditPersonBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') personId: string,
    ) {
        const {
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            notes
        } = body

        const businessId = user.bus

        const result = await this.editPerson.execute({
            businessId: businessId,
            personId: personId,
            name,
            email,
            phone,
            document,
            addressLine1,
            addressLine2,
            addressLine3,
            neighborhood,
            postalCode,
            countryCode,
            stateCode,
            cityCode,
            status,
            notes,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
