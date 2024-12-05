// src/infra/nfse/nfse.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AbrasfNfseService } from './services/abrasf-nfse.service';
import { XmlBuilder } from './services/xml-builder.service';
import { NfseProvider } from '@/domain/dfe/nfse/providers/nfse-provider';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { PrismaModule } from '../database/prisma.module';
import { PrismaNfseRepository } from './repositories/prisma/prisma-nfse-repository';
import { CreateNfseUseCase } from '@/domain/dfe/nfse/use-cases/create-nfse.use-case';
import { GetNfseUseCase } from '@/domain/dfe/nfse/use-cases/get-nfse.use-case';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        PrismaModule,
    ],
    providers: [
        XmlBuilder,
        CreateNfseUseCase,
        GetNfseUseCase,
        {
            provide: NfseProvider,
            useClass: AbrasfNfseService,
        },
        {
            provide: NfseRepository,
            useClass: PrismaNfseRepository,
        },
    ],
    exports: [NfseProvider],
})
export class NfseModule { }