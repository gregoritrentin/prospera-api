import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskSchedulerService {
    private readonly logger = new Logger(TaskSchedulerService.name);

    constructor(private schedulerRegistry: SchedulerRegistry) { }

    scheduleTask(name: string, cronExpression: string, task: () => Promise<void>): void {
        const job = new CronJob(cronExpression, async () => {
            this.logger.log(`Executing scheduled task: ${name}`);
            const startTime = Date.now();
            try {
                await task();
                const duration = Date.now() - startTime;
                this.logger.log(`Task ${name} completed successfully in ${duration}ms`);
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(`Error executing task ${name}: ${error.message}`, error.stack);
                } else {
                    this.logger.error(`Error executing task ${name}: ${error}`);
                }
            }
        });

        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.log(`Task scheduled: ${name} with cron expression: ${cronExpression}`);
    }
}