import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { AppRepository } from '@/domain/application/repositories/app-repository';
import { UserRepository } from '@/domain/application/repositories/user-repository';
import { UserBusinessRepository } from '@/domain/application/repositories/user-business-repository';
import { PersonsRepository } from '@/domain/person/repositories/persons-repository';
import { MarketplaceRepository } from '@/domain/application/repositories/marketplace-repository';
import { PrismaMarketplaceRepository } from './prisma/repositories/prisma-marketplace-repository';
import { PrismaBusinessRepository } from './prisma/repositories/prisma-business-repository';
import { PrismaUserRepository } from '@/infra/database/prisma/repositories/prisma-user-repository';
import { PrismaUserBusinessRepository } from '@/infra/database/prisma/repositories/prisma-user-business-repository';
import { PrismaPersonsRepository } from '@/infra/database/prisma/repositories/prisma-person-repository';
import { PrismaAppRepository } from '@/infra/database/prisma/repositories/prisma-app-repository';
import { PrismaItemRepository } from './prisma/repositories/prisma-item-repository';
import { ItemRepository } from '@/domain/item/repositories/item-repository';
import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository';
import { PrismaItemGroupRepository } from './prisma/repositories/prisma-item-group-repository';
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository';
import { PrismaItemTaxationRepository } from './prisma/repositories/prisma-item-taxation-repository';
import { FileRepository } from '@/domain/file/repository/file-repository';
import { PrismaFilesRepository } from './prisma/repositories/prisma-file-repository';
import { EmailRepository } from '@/domain/email/repositories/email-repository';
import { PrismaEmailRepository } from './prisma/repositories/prisma-email-repository';
import { BusinessOwnerRepository } from '@/domain/application/repositories/business-owner-repository';
import { PrismaBusinessOwnerRepository } from './prisma/repositories/prisma-business-owner-repository';
import { TermRepository } from '@/domain/application/repositories/term-repository';
import { PrismaTermRepository } from './prisma/repositories/prisma-term-repository';
import { UserTermRepository } from '@/domain/application/repositories/user-term-repository';
import { PrismaUserTermRepository } from '@/infra/database/prisma/repositories/prisma-user-term-repository';
import { BusinessAppRepository } from '@/domain/application/repositories/business-app-repository';
import { PrismaBusinessAppRepository } from './prisma/repositories/prisma-business-app-repository';
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { PrismaPaymentRepository } from './prisma/repositories/prisma-payment-pix-repository';
import { WhatsAppRepository } from '@/domain/whatsapp/repositories/whatsapp-repository';
import { PrismaWhatsAppRepository } from './prisma/repositories/prisma-whatsapp-repository';
import { RedisWhatsAppRepository } from './redis/repositories/redis-whatsapp-repository';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository';

@Module({
    imports: [EnvModule],
    providers: [
        PrismaService,
        RedisService,
        RedisWhatsAppRepository,


        {
            provide: BusinessRepository,
            useClass: PrismaBusinessRepository,

        },
        {
            provide: UserBusinessRepository,
            useClass: PrismaUserBusinessRepository,

        },
        {
            provide: BusinessOwnerRepository,
            useClass: PrismaBusinessOwnerRepository,

        },
        {
            provide: BusinessAppRepository,
            useClass: PrismaBusinessAppRepository,

        },
        {
            provide: MarketplaceRepository,
            useClass: PrismaMarketplaceRepository,

        },

        {
            provide: AppRepository,
            useClass: PrismaAppRepository,

        },
        {
            provide: TermRepository,
            useClass: PrismaTermRepository,

        },
        {
            provide: AppRepository,
            useClass: PrismaAppRepository,

        },
        {
            provide: UserTermRepository,
            useClass: PrismaUserTermRepository,

        },
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,

        },
        {
            provide: FileRepository,
            useClass: PrismaFilesRepository,

        },
        {
            provide: EmailRepository,
            useClass: PrismaEmailRepository,

        },
        {
            provide: ItemRepository,
            useClass: PrismaItemRepository,

        },
        {
            provide: ItemGroupRepository,
            useClass: PrismaItemGroupRepository,

        },
        {
            provide: ItemTaxationRepository,
            useClass: PrismaItemTaxationRepository,

        },
        {
            provide: PersonsRepository,
            useClass: PrismaPersonsRepository,

        },
        {
            provide: TransactionRepository,
            useClass: PrismaTransactionRepository,
        },
        {
            provide: PaymentRepository,
            useClass: PrismaPaymentRepository,
        },
        {
            provide: WhatsAppRepository,
            useClass: PrismaWhatsAppRepository,
        },

    ],
    exports: [
        PrismaService,
        RedisService,
        UserRepository,
        AppRepository,
        UserBusinessRepository,
        BusinessRepository,
        BusinessAppRepository,
        TermRepository,
        UserTermRepository,
        MarketplaceRepository,
        BusinessOwnerRepository,
        PersonsRepository,
        ItemRepository,
        ItemGroupRepository,
        ItemTaxationRepository,
        FileRepository,
        EmailRepository,
        TransactionRepository,
        PaymentRepository,
        WhatsAppRepository,

        RedisWhatsAppRepository,
    ],
})
export class DatabaseModule { }