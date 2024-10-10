import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { File } from '@/domain/file/entities/file'
import { FileRepository } from '@/domain/file/repository/file-repository'
import { FileProvider } from '@/domain/interfaces/file-provider'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppError } from '@/core/errors/app-errors'

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

        // if (!/^(image\/(jpeg|png))$/.test(fileType)) {
        //     return left(new InvalidFileTypeError(fileType))
        // }

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
