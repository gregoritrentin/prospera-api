
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [],
  exports: []
})
export class ApplicationModule {}