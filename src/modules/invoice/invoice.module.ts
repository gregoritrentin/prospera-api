
import { Module } from '@nest@shar@core/common';
import { DatabaseModule } from '@shar@shar@core/databa@shar@core/database.module';
import { QueueModule } from '@shar@shar@core/que@shar@core/queue.module';

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
export class InvoiceModule {}