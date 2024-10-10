import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './task-scheduler-service';
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email';
import { QueueModule } from '../queues/queue.module';
import { EmailModule } from '../email/email.module';
import { DatabaseModule } from '../database/database.module';
import { EnvModule } from '../env/env.module';
import { TaskSchedulerConfig } from './task-scheduling-config';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        QueueModule,
        EmailModule,
        DatabaseModule,
        EnvModule,
    ],
    providers: [
        TaskSchedulerService,
        SendAndCreateEmailUseCase,
        TaskSchedulerConfig,
    ],
    exports: [TaskSchedulerService, TaskSchedulerConfig],
})
export class TaskSchedulingModule { }