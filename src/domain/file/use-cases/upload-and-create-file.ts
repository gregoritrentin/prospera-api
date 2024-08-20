import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { File } from '@/domain/file/entities/file'
import { FileRepository } from '@/domain/file/repository/file-repository'
import { Uploader } from '@/domain/storage/uploader'
import { InvalidFileTypeError } from '@/core/errors/invalid-file-type-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UploadAndCreateFileRequest {
    businessId: string
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateFileResponse = Either<
    InvalidFileTypeError,
    { file: File }
>

@Injectable()
export class UploadAndCreateFileUseCase {
    constructor(
        private fileRepository: FileRepository,
        private uploader: Uploader,
    ) { }

    async execute({
        businessId,
        fileName,
        fileType,
        body,
    }: UploadAndCreateFileRequest): Promise<UploadAndCreateFileResponse> {
        if (!/^(image\/(jpeg|png))$/.test(fileType)) {
            return left(new InvalidFileTypeError(fileType))
        }

        const { url } = await this.uploader.upload({ fileName, fileType, body })

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
