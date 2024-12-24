export interface TaskScheduler {

    scheduleTask(name: string, cronExpression: string, task: () => Promise<void>): void;

}