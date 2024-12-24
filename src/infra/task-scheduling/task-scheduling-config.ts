import { Injectable, Logger } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler-service';
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email';
import { ProcessSubscriptionInvoiceUseCase } from '@/domain/subscription/use-cases/process-subscription-invoice';
import { format } from 'date-fns';
import { CreateMonthlySnapshotsUseCase } from '@/domain/account/use-cases/create-monthly-snapshots';
import { ProcessInvoiceNotificationsUseCase } from '@/domain/invoice/use-cases/process-invoice-notification';

@Injectable()
export class TaskSchedulerConfig {
    private readonly logger = new Logger(TaskSchedulerConfig.name);

    constructor(
        private taskScheduler: TaskSchedulerService,
        private sendAndCreateEmail: SendAndCreateEmailUseCase,
        private processSubscriptionInvoice: ProcessSubscriptionInvoiceUseCase,
        private createMonthlySnapshots: CreateMonthlySnapshotsUseCase,
        private processInvoiceNotifications: ProcessInvoiceNotificationsUseCase,

    ) { }

    configure() {


        // Notificações de Faturas task
        this.taskScheduler.scheduleTask(
            'processInvoiceNotifications',
            '0 9 * * *', // Todos os dias às 9h
            async () => {
                this.logger.log('[Invoice] Starting notification processing');
                const startTime = Date.now();

                try {
                    const result = await this.processInvoiceNotifications.execute(
                        {
                            date: new Date()
                        },
                        'pt-BR'
                    );

                    if (result.isRight()) {
                        const duration = Date.now() - startTime;
                        this.logger.log(
                            `[Invoice] Notifications queued successfully:
                                - Duration: ${duration}ms
                                - Job ID: ${result.value.jobId}
                                - Message: ${result.value.message}
                                `
                        );
                    } else {
                        this.logger.error(
                            '[Invoice] Failed to queue notifications:',
                            result.value
                        );
                    }
                } catch (error) {
                    const duration = Date.now() - startTime;
                    if (error instanceof Error) {
                        this.logger.error(
                            `[Invoice] Error queueing notifications:
                                - Duration: ${duration}ms
                                - Error: ${error.message}
                                - Stack: ${error.stack}
                                `
                        );
                    } else {
                        this.logger.error(
                            `[Invoice] Unknown error queueing notifications:
                                - Duration: ${duration}ms
                                - Error: ${String(error)}
                                `
                        );
                    }
                }
            }
        );



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
            '0 1 * * *', //todos os dias as 1h
            //'* * * * *', //a cada minuto
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

        // Account Balance Snapshots task
        this.taskScheduler.scheduleTask(
            'createAccountBalanceSnapshots',
            '0 0 1 * *', // Executa todo dia 1º do mês às 00:00
            async () => {
                this.logger.log('[AccountBalance] Starting monthly snapshots creation task');
                const startTime = Date.now();

                try {
                    const result = await this.createMonthlySnapshots.execute();
                    const duration = Date.now() - startTime;

                    this.logger.log(
                        `[AccountBalance] Monthly snapshots task completed:
                        - Duration: ${duration}ms
                        - Snapshots created: ${result.snapshots.length}
                        - Month/Year: ${format(new Date(), 'MM/yyyy')}`
                    );
                } catch (error) {
                    const duration = Date.now() - startTime;
                    if (error instanceof Error) {
                        this.logger.error(
                            `[AccountBalance] Error creating monthly snapshots:
                            - Duration: ${duration}ms
                            - Error: ${error.message}
                            - Stack: ${error.stack}
                            - Month/Year: ${format(new Date(), 'MM/yyyy')}`
                        );
                    } else {
                        this.logger.error(
                            `[AccountBalance] Unknown error creating monthly snapshots:
                            - Duration: ${duration}ms
                            - Error: ${String(error)}
                            - Month/Year: ${format(new Date(), 'MM/yyyy')}`
                        );
                    }
                }
            }
        );

        this.logger.log('[Config] All tasks configured successfully');
    }
}