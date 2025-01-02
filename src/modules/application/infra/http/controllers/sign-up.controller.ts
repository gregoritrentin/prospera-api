import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common'
import { Request } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from 'create-user.controller'
import { Public } from '@/core/infra/auth/public'
import { CreateBusinessUseCase } from 'create-business.controller'
import { CreateBusinessOwnerUseCase } from 'create-business-owner.controller'
import { SetDefaultBusinessUseCase } from 'set-default-business.controller'
import { CreateUserTermUseCase } from 'create-user-term.controller'
import { CreateUserBusinessUseCase } from 'create-user-business.controller'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
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
    stateCode: z.string(),
    cityCode: z.string(),
    businessSize: z.string(),
    businessType: z.string(),
    foundingDate: z.string().transform((str) => new Date(str)),
    logoFileId: z.string().optional(),
    digitalCertificateFileId: z.string().optional(),
})

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
    stateCode: z.string(),
    cityCode: z.string(),
    birthDate: z.string().transform((str) => new Date(str)),
    status: z.string(),
    ownerType: z.string(),
})

const signUpSchema = z.object({
    user: userSchema,
    business: businessSchema,
    businessOwner: businessOwnerSchema,
})

// Create DTOs for Swagger documentation
class UserDto extends createZodDto(userSchema) { }
class BusinessDto extends createZodDto(businessSchema) { }
class BusinessOwnerDto extends createZodDto(businessOwnerSchema) { }
class SignUpDto extends createZodDto(signUpSchema) { }

type SignUpSchemaBody = z.infer<typeof signUpSchema>

@ApiTags('Authentication')
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
    @ApiOperation({
        summary: 'Register new user with business',
        description: 'Creates a new user account with associated business and business owner information'
    })
    @ApiBody({
        type: SignUpDto,
        description: 'User registration details with business information',
        schema: {
            type: 'object',
            required: ['user', 'business', 'businessOwner'],
            properties: {
                user: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'User full name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        password: {
                            type: 'string',
                            description: 'User password'
                        },
                        defaultBusiness: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Default business ID (optional)'
                        },
                        photoFileId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User photo file ID (optional)'
                        }
                    }
                },
                business: {
                    type: 'object',
                    required: [
                        'marketplaceId', 'name', 'email', 'phone', 'document',
                        'addressLine1', 'addressLine2', 'neighborhood', 'postalCode',
                        'countryCode', 'stateCode', 'cityCode', 'businessSize',
                        'businessType', 'foundingDate'
                    ],
                    properties: {
                        marketplaceId: {
                            type: 'string',
                            description: 'Marketplace identifier'
                        },
                        name: {
                            type: 'string',
                            description: 'Business name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Business email'
                        },
                        phone: {
                            type: 'string',
                            description: 'Business phone number'
                        },
                        document: {
                            type: 'string',
                            description: 'Business document number'
                        },
                        addressLine1: {
                            type: 'string',
                            description: 'Primary address line'
                        },
                        addressLine2: {
                            type: 'string',
                            description: 'Secondary address line'
                        },
                        addressLine3: {
                            type: 'string',
                            description: 'Additional address line (optional)'
                        },
                        neighborhood: {
                            type: 'string',
                            description: 'Neighborhood'
                        },
                        postalCode: {
                            type: 'string',
                            description: 'Postal code'
                        },
                        countryCode: {
                            type: 'string',
                            description: 'Country code'
                        },
                        stateCode: {
                            type: 'string',
                            description: 'State code'
                        },
                        cityCode: {
                            type: 'string',
                            description: 'City code'
                        },
                        businessSize: {
                            type: 'string',
                            description: 'Size of the business'
                        },
                        businessType: {
                            type: 'string',
                            description: 'Type of business'
                        },
                        foundingDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Business founding date'
                        },
                        logoFileId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Business logo file ID (optional)'
                        },
                        digitalCertificateFileId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Digital certificate file ID (optional)'
                        }
                    }
                },
                businessOwner: {
                    type: 'object',
                    required: [
                        'name', 'email', 'phone', 'document', 'addressLine1',
                        'addressLine2', 'neighborhood', 'postalCode', 'countryCode',
                        'stateCode', 'cityCode', 'birthDate', 'status', 'ownerType'
                    ],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Owner full name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Owner email address'
                        },
                        phone: {
                            type: 'string',
                            description: 'Owner phone number'
                        },
                        document: {
                            type: 'string',
                            description: 'Owner document number'
                        },
                        addressLine1: {
                            type: 'string',
                            description: 'Primary address line'
                        },
                        addressLine2: {
                            type: 'string',
                            description: 'Secondary address line'
                        },
                        addressLine3: {
                            type: 'string',
                            description: 'Additional address line (optional)'
                        },
                        neighborhood: {
                            type: 'string',
                            description: 'Neighborhood'
                        },
                        postalCode: {
                            type: 'string',
                            description: 'Postal code'
                        },
                        countryCode: {
                            type: 'string',
                            description: 'Country code'
                        },
                        stateCode: {
                            type: 'string',
                            description: 'State code'
                        },
                        cityCode: {
                            type: 'string',
                            description: 'City code'
                        },
                        birthDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Owner birth date'
                        },
                        status: {
                            type: 'string',
                            description: 'Owner status'
                        },
                        ownerType: {
                            type: 'string',
                            description: 'Type of ownership'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'User, business and business owner created successfully'
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
                    example: 'Invalid registration data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(@Body() body: SignUpSchemaBody, @Req() req: Request) {
        const { user, business, businessOwner } = body

        const userResult = await this.createUser.execute({
            ...user,
            defaultBusiness: user.defaultBusiness || undefined,
            photoFileId: user.photoFileId || undefined,
        })
        if (userResult.isLeft()) {
            throw new BadRequestException(userResult.value.message)
        }

        const businessResult = await this.createBusiness.execute({
            ...business,
        })
        if (businessResult.isLeft()) {
            throw new BadRequestException(businessResult.value.message)
        }

        const userBusinessResult = await this.createUserBusiness.execute({
            userId: userResult.value.user.id.toString(),
            businessId: businessResult.value.business.id.toString(),
            role: 'ADMIN',
        })
        if (userBusinessResult.isLeft()) {
            throw new BadRequestException('User business creation failed')
        }

        const businessOwnerResult = await this.createBusinessOwner.execute({
            ...businessOwner,
            businessId: businessResult.value.business.id.toString(),
        })
        if (businessOwnerResult.isLeft()) {
            throw new BadRequestException('Business owner creation failed')
        }

        const setDefaultBusinessResult = await this.setDefaultBusiness.execute({
            userId: userResult.value.user.id.toString(),
            businessId: businessResult.value.business.id.toString(),
        })
        if (setDefaultBusinessResult.isLeft()) {
            throw new BadRequestException('Set default business failed')
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        const userTermResult = await this.createUserTerm.execute({
            userId: userResult.value.user.id.toString(),
            ip: clientIp as string,
        })
        if (userTermResult.isLeft()) {
            throw new BadRequestException('Accept term failed')
        }
    }
}