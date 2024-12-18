import { PaginationParams } from '@/core/repositories/pagination-params'
import { App } from '@/domain/application/entities/app'

export abstract class AppRepository {
    abstract findById(id: string): Promise<App | null>
    abstract findMany(params: PaginationParams): Promise<App[]>
    abstract save(app: App): Promise<void>
    abstract create(app: App): Promise<void>
    abstract delete(app: App): Promise<void>
}
