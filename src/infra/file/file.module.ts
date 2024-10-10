import { FileProvider } from '@/domain/interfaces/file-provider'
import { Module } from '@nestjs/common'
import { R2Service } from './r2-service'
import { EnvModule } from '../env/env.module'
import { DatabaseModule } from '../database/database.module'
import { BoletoModule } from '../boleto/boleto.module'

@Module({
    imports: [EnvModule, BoletoModule, DatabaseModule],
    providers: [
        {
            provide: FileProvider,
            useClass: R2Service,
        },
    ],
    exports: [FileProvider],
})
export class FileModule { }
