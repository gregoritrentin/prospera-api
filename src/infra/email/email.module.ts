import { EmailProvider } from '@/domain/providers/email-provider'
import { Module } from '@nestjs/common'
import { SendGridService } from './sendgrid-service'
import { EnvModule } from '../env/env.module'
import { DatabaseModule } from '../database/database.module'


@Module({
    imports: [EnvModule, DatabaseModule],
    providers: [
        {
            provide: EmailProvider,
            useClass: SendGridService,
        },
    ],
    exports: [EmailProvider],

})
export class EmailModule { }
