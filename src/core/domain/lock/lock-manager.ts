export abstract class LockManager {
    abstract acquire(key: string, ttl?: number): Promise<boolean>
    abstract release(key: string): Promise<void>
    abstract extend(key: string, ttl?: number): Promise<boolean>
}