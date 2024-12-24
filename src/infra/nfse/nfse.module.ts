// src/infra/nfse/nfse.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Core Modules
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { I18nModule } from '@/i18n';
import { DigitalCertificateModule } from '../digital-certificate/digital-certificate.module';
import { QueueModule } from '../queues/queue.module';

// Services
import { AbrasfNfseService } from './services/abrasf-nfse.service';
import { CertificateSigningService } from './services/certificate-signing.service';
import { RpsResponseProcessor } from './services/rps-response-processor.service';
import { DanfseGeneratorService } from './services/danfse-generator.service';
import { BullQueueService } from '@/infra/queues/queue.service';

// XML Builders
import { XmlBuilderBase } from './xml/builders/xml-builder-base';
import { TransmissionBuilder } from './xml/builders/transmition-builder';
import { QueryBuilder } from './xml/builders/query-builder';
import { CancellationBuilder } from './xml/builders/cancellation-builder';
import { XsdValidator } from './xml/validators/xsd-validator';

// Use Cases
import { CreateNfseUseCase } from '@/domain/dfe/nfse/use-cases/create-nfse';
import { GetNfseUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse';
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business';
import { GetNfseCityProviderUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse-city-provider.use-case';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';

// Queue Consumers
import { NfseQueueConsumer } from '@/infra/queues/consumers/nfse-queue-consumer';

// Providers & Repositories
import { NfseProvider } from '@/domain/providers/nfse-provider';
import { QueueProvider } from '@/domain/providers/queue-provider';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { NfseCityConfigurationRepository } from '@/domain/dfe/nfse/repositories/nfse-city-configuration-repository';
import { PrismaNfseRepository } from '@/infra/database/prisma/repositories/prisma-nfse-repository';
import { PrismaBusinessRepository } from '@/infra/database/prisma/repositories/prisma-business-repository';
import { PrismaNfseCityConfigurationRepository } from '@/infra/database/prisma/repositories/prisma-nfse-city-configuration-repository';

// Entities & Configuration
import { NfseCityConfiguration } from '@/domain/dfe/nfse/entities/nfse-city-configuration';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        DatabaseModule,
        I18nModule,
        forwardRef(() => FileModule),
        DigitalCertificateModule,
        forwardRef(() => QueueModule),
        SharedModule,
    ],
    providers: [
        // Builders
        XmlBuilderBase,
        TransmissionBuilder,
        QueryBuilder,
        CancellationBuilder,

        // Validators
        XsdValidator,

        // Services
        AbrasfNfseService,
        CertificateSigningService,
        RpsResponseProcessor,
        DanfseGeneratorService,

        // Use Cases
        CreateNfseUseCase,
        GetNfseUseCase,
        GetBusinessUseCase,
        GetNfseCityProviderUseCase,
        UploadAndCreateFileUseCase,

        // Queue Consumers
        NfseQueueConsumer,

        // City Configuration
        {
            provide: NfseCityConfiguration,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                cityCode: configService.get('NFSE_CITY_CODE', '4205407'),
                productionUrl: configService.get('NFSE_PRODUCTION_URL', ''),
                homologationUrl: configService.get('NFSE_HOMOLOGATION_URL', ''),
                version: configService.get('NFSE_VERSION', '2.00'),
                timeout: configService.get('NFSE_TIMEOUT', 30000),
                environment: configService.get('NFSE_ENVIRONMENT', 'production'),
                provider: configService.get('NFSE_PROVIDER', 'ABRASF'),
                schemaVersion: configService.get('NFSE_SCHEMA_VERSION', '2.04'),
            }),
        },

        // Providers & Repositories
        {
            provide: NfseProvider,
            useClass: AbrasfNfseService,
        },
        // {
        //     provide: QueueProvider,
        //     useClass: BullQueueService,
        // },
        {
            provide: NfseRepository,
            useClass: PrismaNfseRepository,
        },
        {
            provide: BusinessRepository,
            useClass: PrismaBusinessRepository,
        },
        {
            provide: NfseCityConfigurationRepository,
            useClass: PrismaNfseCityConfigurationRepository,
        },
    ],
    exports: [
        // Services
        NfseProvider,
        AbrasfNfseService,
        DanfseGeneratorService,
        CertificateSigningService,
        RpsResponseProcessor,

        // Queue Consumers 
        NfseQueueConsumer,


        // Repositories
        NfseRepository,
        BusinessRepository,
        NfseCityConfigurationRepository,

        // Use Cases
        GetNfseCityProviderUseCase,
        CreateNfseUseCase,
        GetNfseUseCase,
        GetBusinessUseCase,
        UploadAndCreateFileUseCase,

        // XML Related
        XmlBuilderBase,
        TransmissionBuilder,
        QueryBuilder,
        CancellationBuilder,
        XsdValidator,

        // Configuration
        NfseCityConfiguration,
    ],
})
export class NfseModule { }