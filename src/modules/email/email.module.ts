import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/providers/databa/database.module'
import { QueueModule } from '@/shared/providers/que/queue.module'

@Module({
  imports: [
    DatabaseModule,
    QueueModule,
  ],
  providers: [
  @core// Providers serão adicionados aqui
  ],
  exports: [
  @core// Exports serão adicionados aqui
  ]
})
export class EmailModule {}