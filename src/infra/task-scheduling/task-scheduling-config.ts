import { Injectable, Logger } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler-service';
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email';
import { ProcessSubscriptionInvoiceUseCase } from '@/domain/subscription/use-cases/process-subscription-invoice';
import { format } from 'date-fns';

@Injectable()
export class TaskSchedulerConfig {
    private readonly logger = new Logger(TaskSchedulerConfig.name);

    constructor(
        private taskScheduler: TaskSchedulerService,
        private sendAndCreateEmail: SendAndCreateEmailUseCase,
        private processSubscriptionInvoice: ProcessSubscriptionInvoiceUseCase,
    ) { }

    configure() {
        // Email task configuration
        this.taskScheduler.scheduleTask(
            'sendAndCreateEmail',
            '5 * * * *',
            async () => {
                this.logger.log('[Email] Starting sendAndCreateEmail task');
                const startTime = Date.now();

                try {
                    await this.sendAndCreateEmail.execute({
                        to: 'gregori@prosperatecnologia.com.br',
                        subject: 'Teste',
                        body: 'Teste',
                    });

                    const duration = Date.now() - startTime;
                    this.logger.log(`[Email] sendAndCreateEmail task completed in ${duration}ms`);
                } catch (error) {
                    if (error instanceof Error) {
                        this.logger.error(`[Email] Error in sendAndCreateEmail task: ${error.message}`, error.stack);
                    } else {
                        this.logger.error('[Email] Unknown error in sendAndCreateEmail task', error);
                    }
                }
            }
        );

        // Subscription Invoice Processing task
        this.taskScheduler.scheduleTask(
            'processSubscriptionInvoices',
            //'0 1 * * *', //todos os dias as 1h
            '* * * * *', //a cada minuto
            async () => {
                this.logger.log('[Subscription] Starting processSubscriptionInvoices task');
                const startTime = Date.now();

                // Criando as datas no horário UTC
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                const day = today.getDate();

                const utcStartDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                const utcEndDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

                try {
                    this.logger.debug(
                        `[Subscription] Processing date range: ${utcStartDate.toISOString()} to ${utcEndDate.toISOString()}`
                    );

                    const result = await this.processSubscriptionInvoice.execute(
                        {
                            startDate: utcStartDate,
                            endDate: utcEndDate,
                        },
                        'pt-BR'
                    );

                    if (result.isRight()) {
                        const duration = Date.now() - startTime;
                        this.logger.log(
                            `[Subscription] Task completed successfully:
                           - Duration: ${duration}ms
                           - Job ID: ${result.value.jobId}
                           - Message: ${result.value.message}
                           - Date Range: ${utcStartDate.toISOString()} to ${utcEndDate.toISOString()}`
                        );
                    } else {
                        this.logger.error(
                            '[Subscription] Failed to process subscription invoices:',
                            {
                                error: result.value,
                                dateRange: {
                                    start: utcStartDate.toISOString(),
                                    end: utcEndDate.toISOString()
                                }
                            }
                        );
                    }
                } catch (error) {
                    const duration = Date.now() - startTime;
                    if (error instanceof Error) {
                        this.logger.error(
                            `[Subscription] Error processing subscription invoices:
                           - Duration: ${duration}ms
                           - Error: ${error.message}
                           - Stack: ${error.stack}
                           - Date Range: ${utcStartDate.toISOString()} to ${utcEndDate.toISOString()}`
                        );
                    } else {
                        this.logger.error(
                            `[Subscription] Unknown error processing subscription invoices:
                           - Duration: ${duration}ms
                           - Error: ${String(error)}
                           - Date Range: ${utcStartDate.toISOString()} to ${utcEndDate.toISOString()}`
                        );
                    }
                }
            }
        );

        this.logger.log('[Config] All tasks configured successfully');
    }
}