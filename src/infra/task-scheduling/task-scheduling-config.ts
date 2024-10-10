import { Injectable, Logger } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler-service';
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email';

@Injectable()
export class TaskSchedulerConfig {
    private readonly logger = new Logger(TaskSchedulerConfig.name);

    constructor(
        private taskScheduler: TaskSchedulerService,
        private sendAndCreateEmail: SendAndCreateEmailUseCase,
    ) { }

    configure() {
        this.taskScheduler.scheduleTask(
            'sendAndCreateEmail',
            '5 * * * *',
            async () => {
                this.logger.log('Starting sendAndCreateEmail task');
                const startTime = Date.now();

                try {
                    await this.sendAndCreateEmail.execute({
                        to: 'gregori@prosperatecnologia.com.br',
                        subject: 'Teste',
                        body: 'Teste',
                    });

                    const duration = Date.now() - startTime;
                    this.logger.log(`sendAndCreateEmail task completed in ${duration}ms`);
                } catch (error) {
                    if (error instanceof Error) {
                        this.logger.error(`Error in sendAndCreateEmail task: ${error.message}`, error.stack);
                    } else {
                        this.logger.error('Unknown error in sendAndCreateEmail task', error);
                    }
                }
            }
        );

        this.logger.log('All tasks configured');
    }
}