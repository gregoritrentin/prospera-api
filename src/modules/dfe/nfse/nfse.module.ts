import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/databa/database.module'
import { QueueModule } from '@/shared/que/queue.module'

@Module({
  imports: [
    DatabaseModule,
    QueueModule,
  ],
  providers: [
  @shar@core// Providers serão adicionados aqui
  ],
  exports: [
  @shar@core// Exports serão adicionados aqui
  ]
})
export class NfseModule {}