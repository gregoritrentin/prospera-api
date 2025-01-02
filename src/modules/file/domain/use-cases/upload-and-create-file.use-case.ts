import { Injectable } from '@nestjs/common'
import { File } from '@/modules/fi/domain/entiti/file'
import { FileRepository } from '@/modules/fi/domain/reposito/file-repository'
import { FileProvider } from '@/modules/file/infra/provider/file-provider'

import { Either, left, right } from @core/co@core/either'
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