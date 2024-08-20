
import { InvalidFileTypeError } from '@/core/errors/invalid-file-type-error'
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/upload/user-photo')
export class UploadPhotoController {
    constructor(
        private uploadUserPhoto: UploadAndCreateFileUseCase,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async handle(
        @CurrentUser() user: UserPayload,
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

        const { file } = result.value

        return {
            fileId: file.id.toString(),
        }
    }
}
