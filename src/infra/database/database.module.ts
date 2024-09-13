import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service';

import { BusinessRepository } from '@/domain/core/repositories/business-repository';
import { AppRepository } from '@/domain/core/repositories/app-repository';
import { UserRepository } from '@/domain/core/repositories/user-repository';
import { UserBusinessRepository } from '@/domain/core/repositories/user-business-repository';
import { PersonRepository } from '@/domain/person/repositories/person-repository';
import { MarketplaceRepository } from '@/domain/core/repositories/marketplace-repository';
import { PrismaMarketplaceRepository } from './prisma/repositories/prisma-marketplace-repository';
import { PrismaBusinessRepository } from './prisma/repositories/prisma-business-repository';
import { PrismaUserRepository } from '@/infra/database/prisma/repositories/prisma-user-repository';
import { PrismaUserBusinessRepository } from '@/infra/database/prisma/repositories/prisma-user-business-repository';
import { PrismaPersonRepository } from '@/infra/database/prisma/repositories/prisma-person-repository';
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
import { BusinessOwnerRepository } from '@/domain/core/repositories/business-owner-repository';
import { PrismaBusinessOwnerRepository } from './prisma/repositories/prisma-business-owner-repository';
import { TermRepository } from '@/domain/core/repositories/term-repository';
import { PrismaTermRepository } from './prisma/repositories/prisma-term-repository';
import { UserTermRepository } from '@/domain/core/repositories/user-term-repository';
import { PrismaUserTermRepository } from '@/infra/database/prisma/repositories/prisma-user-term-repository';
import { BusinessAppRepository } from '@/domain/core/repositories/business-app-repository';
import { PrismaBusinessAppRepository } from './prisma/repositories/prisma-business-app-repository';



@Module({
    providers: [
        PrismaService,

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
            provide: PersonRepository,
            useClass: PrismaPersonRepository,

        },

    ],
    exports: [
        PrismaService,
        UserRepository,
        AppRepository,
        UserBusinessRepository,
        BusinessRepository,
        BusinessAppRepository,
        TermRepository,
        UserTermRepository,
        MarketplaceRepository,
        BusinessOwnerRepository,
        PersonRepository,
        ItemRepository,
        ItemGroupRepository,
        ItemTaxationRepository,

        FileRepository,
        EmailRepository,

    ],
})
export class DatabaseModule { }