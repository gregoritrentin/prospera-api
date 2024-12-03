import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './task-scheduler-service';
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email';
import { QueueModule } from '../queues/queue.module';
import { EmailModule } from '../email/email.module';
import { DatabaseModule } from '../database/database.module';
import { EnvModule } from '../env/env.module';
import { TaskSchedulerConfig } from './task-scheduling-config';
//cimport { Process } from '@nestjs/bull';
import { ProcessSubscriptionInvoiceUseCase } from '@/domain/subscription/use-cases/process-subscription-invoice';
import { I18nModule } from '@/i18n';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        QueueModule,
        EmailModule,
        DatabaseModule,
        EnvModule,
        I18nModule,
    ],
    providers: [
        TaskSchedulerService,
        TaskSchedulerConfig,
        SendAndCreateEmailUseCase,
        ProcessSubscriptionInvoiceUseCase
        ,
    ],
    exports: [TaskSchedulerService, TaskSchedulerConfig, ProcessSubscriptionInvoiceUseCase], //
})
export class TaskSchedulingModule { }