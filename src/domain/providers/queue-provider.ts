export interface QueueJobResult<T = any> {
    jobId: string;
    result?: T;
}

export abstract class QueueProvider {
    abstract addJob<T = any>(
        queue: string,
        jobName: string,
        data: any
    ): Promise<QueueJobResult<T>>;
}
