// domain/interfaces/file-provider.ts
export interface FileParams {
    businessId: string
    folderName: string
    fileName: string
    fileType: string
    body: Buffer
}

export interface FileDownloadParams {
    businessId: string
    folderName: string
    fileName: string
}

export interface FileListParams {
    businessId: string
    folderName?: string
    prefix?: string
}

export abstract class FileProvider {
    abstract upload(params: FileParams): Promise<{ url: string }>
    abstract download(params: FileDownloadParams): Promise<Buffer>
    abstract delete(params: FileDownloadParams): Promise<void>
    abstract list(params: FileListParams): Promise<string[]>
    abstract getSignedUrl(params: FileDownloadParams): Promise<string>
    abstract exists(params: FileDownloadParams): Promise<boolean>
}