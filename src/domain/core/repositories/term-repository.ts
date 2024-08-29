import { PaginationParams } from '@/core/repositories/pagination-params'
import { Term } from '@/domain/core/entities/term'

export abstract class TermRepository {
    abstract findById(id: string): Promise<Term | null>
    abstract findLatest(): Promise<Term | null>
    abstract findMany(params: PaginationParams): Promise<Term[]>
    abstract save(term: Term): Promise<void>
    abstract create(term: Term): Promise<void>
    abstract delete(term: Term): Promise<void>
}
