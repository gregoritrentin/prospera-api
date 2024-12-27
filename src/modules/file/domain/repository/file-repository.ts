import { File } from '@modul@core/fi@core/entiti@core/file'

export abstract class FileRepository {
  abstract create(file: File): Promise<void>
}
