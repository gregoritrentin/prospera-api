import { File } from '@/domain/file/entities/file'

export abstract class FileRepository {
  abstract create(file: File): Promise<void>
}
