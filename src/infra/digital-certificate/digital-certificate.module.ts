// src/infra/digital-certificate/digital-certificate.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { I18nModule } from '@/i18n';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';

// Providers & Services
import { DigitalCertificateProvider } from '@/domain/providers/digital-certificate-provider';
import { DigitalCertificateReaderService } from './services/certificate-reader.service';
import { DigitalCertificateRepository } from '@/domain/digital-certificate/repositories/digital-certificate-repository';
import { PrismaDigitalCertificateRepository } from '@/infra/database/prisma/repositories/prisma-digital-certificate-repository';

// Use Cases
import { CreateDigitalCertificateUseCase } from '@/domain/digital-certificate/use-cases/create-digital-certificate';
import { GetBusinessActiveDigitalCertificateUseCase } from '@/domain/digital-certificate/use-cases/get-business-ative-digital-certificate';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';

@Module({
    imports: [
        DatabaseModule,
        I18nModule,
        forwardRef(() => FileModule),  // Adicione forwardRef aqui
    ],
    providers: [
        {
            provide: DigitalCertificateProvider,
            useClass: DigitalCertificateReaderService
        },
        {
            provide: DigitalCertificateRepository,
            useClass: PrismaDigitalCertificateRepository
        },
        CreateDigitalCertificateUseCase,
        GetBusinessActiveDigitalCertificateUseCase,
        UploadAndCreateFileUseCase,
    ],
    exports: [
        DigitalCertificateProvider,
        DigitalCertificateRepository,
        GetBusinessActiveDigitalCertificateUseCase,
        CreateDigitalCertificateUseCase,
    ]
})
export class DigitalCertificateModule { }