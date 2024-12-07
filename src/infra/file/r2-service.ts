import { FileParams, FileProvider, FileDownloadParams, FileListParams } from '@/domain/interfaces/file-provider'
import {
    PutObjectCommand,
    S3Client,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    GetObjectCommandInput,
    HeadObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class R2Service implements FileProvider {
    private s3Client: S3Client

    constructor(private envService: EnvService) {
        const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

        this.s3Client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
            },
        })
    }

    private getFullPath({ businessId, folderName, fileName }: FileDownloadParams): string {
        return `${businessId}/${folderName}/${fileName}`
    }

    async upload({
        businessId,
        folderName,
        fileName,
        fileType,
        body,
    }: FileParams): Promise<{ url: string }> {
        const uploadId = randomUUID()
        const uniqueFileName = `${businessId}/${folderName}/${uploadId}${fileName}`

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.envService.get('AWS_BUCKET_NAME'),
                Key: uniqueFileName,
                ContentType: fileType,
                Body: body,
            }),
        )

        return {
            url: uniqueFileName,
        }
    }

    async download({ businessId, folderName, fileName }: FileDownloadParams): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.envService.get('AWS_BUCKET_NAME'),
            Key: this.getFullPath({ businessId, folderName, fileName }),
        })

        const response = await this.s3Client.send(command)

        if (!response.Body) {
            throw new Error('File not found')
        }

        return Buffer.from(await response.Body.transformToByteArray())
    }

    async delete({ businessId, folderName, fileName }: FileDownloadParams): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.envService.get('AWS_BUCKET_NAME'),
            Key: this.getFullPath({ businessId, folderName, fileName }),
        })

        await this.s3Client.send(command)
    }

    async list({ businessId, folderName, prefix }: FileListParams): Promise<string[]> {
        const basePath = folderName ? `${businessId}/${folderName}/` : `${businessId}/`
        const fullPrefix = prefix ? `${basePath}${prefix}` : basePath

        const command = new ListObjectsV2Command({
            Bucket: this.envService.get('AWS_BUCKET_NAME'),
            Prefix: fullPrefix,
        })

        const response = await this.s3Client.send(command)

        return (response.Contents || [])
            .map(item => item.Key || '')
            .filter(key => key !== '')
    }

    async getSignedUrl({ businessId, folderName, fileName }: FileDownloadParams): Promise<string> {
        const params: GetObjectCommandInput = {
            Bucket: this.envService.get('AWS_BUCKET_NAME'),
            Key: this.getFullPath({ businessId, folderName, fileName }),
        }

        const command = new GetObjectCommand(params)

        // URL expira em 1 hora
        return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
    }

    async exists({ businessId, folderName, fileName }: FileDownloadParams): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.envService.get('AWS_BUCKET_NAME'),
                Key: this.getFullPath({ businessId, folderName, fileName }),
            })

            await this.s3Client.send(command)
            return true
        } catch (error) {
            return false
        }
    }
}