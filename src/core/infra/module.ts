import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { I18nModule } from '@/modules/i18n/i18n.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { CryptographyModule } from './cryptography/cryptografhy.module'
import { EnvModule } from './config/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    AuthModule,
    CryptographyModule,
    HttpModule,
    I18nModule,
  ],
})
export class AppModule {}