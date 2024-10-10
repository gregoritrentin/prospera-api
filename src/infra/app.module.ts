import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvService } from './env/env.service'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { QueueModule } from './queues/queue.module'
import { TaskSchedulingModule } from './task-scheduling/task-scheduling.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    QueueModule,
    TaskSchedulingModule,
  ],
  providers: [EnvService],
})
export class AppModule { }