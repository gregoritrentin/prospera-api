import { WhatsAppProvider } from '@/domain/providers/whatsapp-provider'
import { Module } from '@nestjs/common'
import { WhatsAppService } from '@/infra/whatsapp/whatsapp.service'
import { EnvModule } from '../env/env.module'
import { DatabaseModule } from '../database/database.module'
import { FileModule } from '../file/file.module'

@Module({
    imports: [EnvModule, FileModule, DatabaseModule],
    providers: [
        {
            provide: WhatsAppProvider,
            useClass: WhatsAppService,
        },
    ],
    exports: [WhatsAppProvider],
})
export class WhatsAppModule { }