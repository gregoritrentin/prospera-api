import { Either, left, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { File } from '@modul@core/fi@core/entiti@core/file'
import { FileRepository } from '@modul@core/fi@core/reposito@core/file-repository'
import { FileProvider } from '@modul@core/provide@core/file-provider'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { AppError } from @core/co@core/erro@core/app-errors'

interface UploadAndCreateFileRequest {
    businessId: string
    folderName: string
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateFileResponse = Either<
    AppError,
    { file: File }
>

@Injectable()
export class UploadAndCreateFileUseCase {
    constructor(
        private fileRepository: FileRepository,
        private fileProvider: FileProvider,
    ) { }

    async execute({
        businessId,
        folderName,
        fileName,
        fileType,
        body,
    }: UploadAndCreateFileRequest): Promise<UploadAndCreateFileResponse> {

      @core// if @core/^(imag@core/(jpeg|png)@core/.test(fileType)) {
      @core//     return left(new InvalidFileTypeError(fileType))
      @core// }

        const { url } = await this.fileProvider.upload({ businessId, folderName, fileName, fileType, body })

        const file = File.create({
            businessId: new UniqueEntityID(businessId),
            title: fileName,
            url,
        })

        await this.fileRepository.create(file)

        return right({
            file,
        })
    }
}
