import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service';

import { BusinessRepository } from '@/domain/business/repository/business-repository';
import { AppRepository } from '@/domain/app/repository/app-repository';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { UserBusinessRepository } from '@/domain/user/repositories/user-business-repository';
import { PersonRepository } from '@/domain/person/repositories/person-repository';
import { MarketplaceRepository } from '@/domain/business/repository/marketplace-repository';

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



@Module({
    providers: [
        PrismaService,

        {
            provide: BusinessRepository,
            useClass: PrismaBusinessRepository,

        },
        {
            provide: AppRepository,
            useClass: PrismaAppRepository,

        },
        {
            provide: PersonRepository,
            useClass: PrismaPersonRepository,

        },
        {
            provide: MarketplaceRepository,
            useClass: PrismaMarketplaceRepository,

        },
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,

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
            provide: UserBusinessRepository,
            useClass: PrismaUserBusinessRepository,

        },



    ],
    exports: [
        PrismaService,

        UserRepository,
        AppRepository,
        UserBusinessRepository,
        BusinessRepository,
        PersonRepository,
        ItemRepository,
        ItemGroupRepository,
        ItemTaxationRepository,
        MarketplaceRepository,
    ],
})
export class DatabaseModule { }