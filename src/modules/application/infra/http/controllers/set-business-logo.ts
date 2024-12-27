import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file'
import { SetBusinessLogoUseCase } from '@/domain/application/use-cases/set-business-logo'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Param,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppError } from '@core/error/app-errors'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiConsumes, ApiBody, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Businesses')
@Controller('business/logo/:id')
@ApiSecurity('bearer')
export class SetBusinessLogoController {
    constructor(
        private uploadBusinessLogo: UploadAndCreateFileUseCase,
        private setBusinessLogo: SetBusinessLogoUseCase,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Upload business logo',
        description: 'Uploads and sets a new logo for a business'
    })
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'id',
        description: 'Business ID',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        description: 'Logo file upload',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (PNG, JPG, JPEG) max 2MB'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Logo uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                fileId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Uploaded file ID'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid file type or size',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid file type'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') businessId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 1024 * 1024 * 2, // 2mb
                    }),
                    new FileTypeValidator({
                        fileType: '.(png|jpg|jpeg)',
                    }),
                ],
            }),
        )
        fileMulter: Express.Multer.File,
    ) {
        const business = user.bus

        const result = await this.uploadBusinessLogo.execute({
            businessId: business,
            folderName: 'others',
            fileName: fileMulter.originalname,
            fileType: fileMulter.mimetype,
            body: fileMulter.buffer,
        })

        if (result.isLeft()) {
            const error = result.value

            switch (error.constructor) {
                case AppError.invalidFileType:
                    throw new BadRequestException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        await this.setBusinessLogo.execute({
            businessId: businessId,
            logoFileId: result.value.file.id.toString(),
        })

        const { file } = result.value

        return {
            fileId: file.id.toString(),
        }
    }
}