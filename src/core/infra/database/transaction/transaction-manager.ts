export abstract class TransactionManager {
    abstract start<T>(callback: () => Promise<T>): Promise<T>
}