import { File } from '@/modules/fi/domain/entiti/file'

export abstract class FileRepository {
  abstract create(file: File): Promise<void>
}