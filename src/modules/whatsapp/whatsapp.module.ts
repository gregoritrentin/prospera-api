import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/providers/databa/database.module'

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
export class WhatsappModule {}