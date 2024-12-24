// file.module.ts
import { FileProvider } from '@/domain/providers/file-provider';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { Module, forwardRef } from '@nestjs/common';
import { R2Service } from './r2-service';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { BoletoModule } from '../boleto/boleto.module';
import { NfseModule } from '../nfse/nfse.module';
import { DigitalCertificateModule } from '../digital-certificate/digital-certificate.module';

@Module({
    imports: [
        EnvModule,
        DatabaseModule,
        forwardRef(() => BoletoModule),
        forwardRef(() => NfseModule),
        forwardRef(() => DigitalCertificateModule),
    ],
    providers: [
        {
            provide: FileProvider,
            useClass: R2Service,
        },
        UploadAndCreateFileUseCase,
    ],
    exports: [
        FileProvider,
        UploadAndCreateFileUseCase,
    ],
})
export class FileModule { }