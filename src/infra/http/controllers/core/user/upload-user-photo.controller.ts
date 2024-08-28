
import { InvalidFileTypeError } from '@/core/errors/invalid-file-type-error'
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file'
import { SetUserPhotoUseCase } from '@/domain/core/use-cases/set-user-photo'
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

@Controller('user/upload-photo/:id')
export class UploadPhotoController {
    constructor(
        private uploadUserPhoto: UploadAndCreateFileUseCase,
        private setUserPhoto: SetUserPhotoUseCase,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
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
            fileName: fileMulter.originalname,
            fileType: fileMulter.mimetype,
            body: fileMulter.buffer,
        })

        if (result.isLeft()) {
            const error = result.value

            switch (error.constructor) {
                case InvalidFileTypeError:
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
