import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { Public } from '@/infra/auth/public'
import { AppError } from '@/core/errors/app-errors'

// Utilitário de conversão Zod para Swagger corrigido
function zodToSwagger(schema: z.ZodType<any, any, any>) {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const swaggerSchema: any = {
      type: 'object',
      properties: {},
      required: [],
    };

    Object.entries(shape).forEach(([key, value]) => {
      let propertySchema: any = {};

      if (value instanceof z.ZodString) {
        propertySchema.type = 'string';
        if (value._def.checks.some(check => check.kind === 'email')) {
          propertySchema.format = 'email';
        }
      } else if (value instanceof z.ZodNumber) {
        propertySchema.type = 'number';
      } else if (value instanceof z.ZodBoolean) {
        propertySchema.type = 'boolean';
      } else if (value instanceof z.ZodOptional) {
        propertySchema = zodToSwagger(value.unwrap());
        propertySchema.nullable = true;
      }
      // Adicione mais casos conforme necessário para outros tipos Zod

      swaggerSchema.properties[key] = propertySchema;

      if (!(value instanceof z.ZodOptional)) {
        swaggerSchema.required.push(key);
      }
    });

    return swaggerSchema;
  }

  // Para tipos não-objeto, retorne um schema básico
  return { type: 'object' };
}

// Schema de validação Zod
const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  defaultBusiness: z.string().optional(),
  photoFileId: z.string().optional(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

//@ApiTags('usersssss')
@Controller('/user')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) { }

  @Post()
  @HttpCode(201)
  //@UsePipes(new ZodValidationPipe(createUserBodySchema))
  //@ApiOperation({ summary: 'Create a new user' })
  // @ApiBody({ schema: zodToSwagger(createUserBodySchema) })
  // @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  // @ApiResponse({ status: 409, description: 'User already exists.' })
  async handle(@Body() body: CreateUserBodySchema) {
    const {
      name,
      email,
      password,
      defaultBusiness,
      photoFileId,
    } = body

    const result = await this.createUser.execute({
      name,
      email,
      password,
      defaultBusiness: defaultBusiness || undefined,
      photoFileId: photoFileId || undefined,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AppError.uniqueConstraintViolation:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}