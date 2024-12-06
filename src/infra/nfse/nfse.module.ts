import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AbrasfNfseService } from './services/abrasf-nfse.service';
import { XmlBuilderBase } from '@/infra/nfse/xml/builders/xml-builder-base';
import { NfseProvider } from '@/domain/interfaces/nfse-provider';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { PrismaNfseRepository } from '@/infra/database/prisma/repositories/prisma-nfse-repository';
import { CreateNfseUseCase } from '@/domain/dfe/nfse/use-cases/create-nfse';
import { GetNfseUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse';
import { DatabaseModule } from '../database/database.module';
import { TransmissionBuilder } from './xml/builders/transmition-builder';
import { QueryBuilder } from './xml/builders/query-builder';
import { CancellationBuilder } from './xml/builders/cancellation-builder';
import { CertificateSigningService } from './services/certificate-signing.service';
import { RpsResponseProcessor } from './services/rps-response-processor.service';
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business';
import { XsdValidator } from './xml/validators/xsd-validator';
import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { PrismaBusinessRepository } from '@/infra/database/prisma/repositories/prisma-business-repository';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        DatabaseModule,
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
        CertificateSigningService,
        RpsResponseProcessor,

        // Use Cases
        CreateNfseUseCase,
        GetNfseUseCase,
        GetBusinessUseCase,

        // Providers & Repositories
        {
            provide: NfseProvider,
            useClass: AbrasfNfseService,
        },
        {
            provide: NfseRepository,
            useClass: PrismaNfseRepository,
        },
        {
            provide: BusinessRepository,
            useClass: PrismaBusinessRepository,
        }
    ],
    exports: [NfseProvider],
})
export class NfseModule { }