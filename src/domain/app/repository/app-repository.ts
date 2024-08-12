import { PaginationParams } from '@/core/repositories/pagination-params'
import { App } from '@/domain/app/entities/app'

export abstract class AppRepository {
    abstract findById(id: string): Promise<App | null>
    abstract findMany(params: PaginationParams): Promise<App[]>
    abstract save(business: App): Promise<void>
    abstract create(business: App): Promise<void>
    abstract delete(business: App): Promise<void>
}
