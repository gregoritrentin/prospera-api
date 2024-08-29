import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common'
import { Request } from 'express';
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from '@/domain/core/use-cases/create-user'
import { Public } from '@/infra/auth/public'
import { CreateBusinessUseCase } from '@/domain/core/use-cases/create-business'
import { CreateBusinessOwnerUseCase } from '@/domain/core/use-cases/create-business-owner'
import { SetDefaultBusinessUseCase } from '@/domain/core/use-cases/set-default-business'
import { CreateUserTermUseCase } from '@/domain/core/use-cases/create-user-term'
import { CreateUserBusinessUseCase } from '@/domain/core/use-cases/create-user-business';

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    defaultBusiness: z.string().optional(),
    photoFileId: z.string().optional(),
})

const businessSchema = z.object({
    marketplaceId: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    document: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    state: z.string(),
    city: z.string(),
    businessSize: z.string(),
    businessType: z.string(),
    logoFileId: z.string().optional(),
    digitalCertificateFileId: z.string().optional(),
});

const businessOwnerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string().optional(),
    neighborhood: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    state: z.string(),
    city: z.string(),
    status: z.string(),
    ownerType: z.string(),
});

const signUpSchema = z.object({
    user: userSchema,
    business: businessSchema,
    businessOwner: businessOwnerSchema,
});

type SignUpSchemaBody = z.infer<typeof signUpSchema>

@Controller('/signup')
@Public()
export class SignUpController {
    constructor(
        private createUser: CreateUserUseCase,
        private createBusiness: CreateBusinessUseCase,
        private createUserBusiness: CreateUserBusinessUseCase,
        private createBusinessOwner: CreateBusinessOwnerUseCase,
        private setDefaultBusiness: SetDefaultBusinessUseCase,
        private createUserTerm: CreateUserTermUseCase,
    ) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(signUpSchema))
    async handle(@Body() body: SignUpSchemaBody, @Req() req: Request) {
        const { user, business, businessOwner } = body;

        //handle user creation
        const userResult = await this.createUser.execute({
            ...user,
            defaultBusiness: user.defaultBusiness || undefined,
            photoFileId: user.photoFileId || undefined,
        });
        if (userResult.isLeft()) {
            throw new BadRequestException(userResult.value.message);
        }

        //handle business creation
        const businessResult = await this.createBusiness.execute({
            ...business,

        });
        if (businessResult.isLeft()) {
            throw new BadRequestException(businessResult.value.message);
        }

        //handle user business creation
        const userBusinessResult = await this.createUserBusiness.execute({
            userId: userResult.value.user.id.toString(),
            businessId: businessResult.value.business.id.toString(),
            role: 'ADMIN',
        });
        if (userBusinessResult.isLeft()) {
            throw new BadRequestException('User business creation failed');
        }

        //handle business owner creation
        const businessOwnerResult = await this.createBusinessOwner.execute({
            ...businessOwner,
            businessId: businessResult.value.business.id.toString(),
        });
        if (businessOwnerResult.isLeft()) {
            throw new BadRequestException('Business owner creation failed');
        }

        //handle set default business
        const setDefaultBusinessResult = await this.setDefaultBusiness.execute({
            userId: userResult.value.user.id.toString(),
            businessId: businessResult.value.business.id.toString(),
        });
        if (setDefaultBusinessResult.isLeft()) {
            throw new BadRequestException('Set default business failed');
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        //handle user term creation
        const userTermResult = await this.createUserTerm.execute({
            userId: userResult.value.user.id.toString(),
            ip: clientIp as string,

        });
        if (userTermResult.isLeft()) {
            throw new BadRequestException('Accept term failed');
        }
    }

}