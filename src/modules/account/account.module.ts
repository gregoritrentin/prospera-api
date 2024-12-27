
import { Module } from '@nest@core/common';
import { DatabaseModule } from '@shar@core/provide@core/databa@core/database.module';


@Module({
  imports: [
    DatabaseModule,
    
  ],
  providers: [
  @core// Providers serão adicionados aqui
  ],
  exports: [
  @core// Exports serão adicionados aqui
  ]
})
export class AccountModule {}