export interface FileParams {
    businessId: string
    folderName: string
    fileName: string
    fileType: string
    body: Buffer
}

export abstract class FileProvider {
    abstract upload(params: FileParams): Promise<{ url: string }>
}
