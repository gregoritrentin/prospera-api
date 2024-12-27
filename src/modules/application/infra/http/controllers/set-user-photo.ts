import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file'
import { SetUserPhotoUseCase } from '@/domain/application/use-cases/set-user-photo'
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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiSecurity, ApiParam } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('user/upload-photo/:id')
@ApiSecurity('bearer')
export class SetUserPhotoController {
    constructor(
        private uploadUserPhoto: UploadAndCreateFileUseCase,
        private setUserPhoto: SetUserPhotoUseCase,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Upload user photo',
        description: 'Uploads and sets a new profile photo for a specific user'
    })
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'User ID',
        format: 'uuid'
    })
    @ApiBody({
        description: 'User profile photo',
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Photo file (PNG, JPG, or JPEG, max 2MB)'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Photo uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                fileId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the uploaded file'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid file or input data',
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
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') userId: string,
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

        const result = await this.uploadUserPhoto.execute({
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

        await this.setUserPhoto.execute({
            userId: userId,
            photoFileId: result.value.file.id.toString(),
        })

        const { file } = result.value

        return {
            fileId: file.id.toString(),
        }
    }
}