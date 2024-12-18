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
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository';
import { PrismaInvoiceRepository } from './prisma/repositories/prisma-invoice-repository';
import { RedisIdempotencyRepository } from './redis/repositories/redis-idempotency-repository';
import { RedisRateLimitRepository } from './redis/repositories/redis-rate-limit-repository';
import { SubscriptionRepository } from '@/domain/subscription/repositories/subscription-repository';
import { PrismaSubscriptionRepository } from './prisma/repositories/prisma-subscription-repository';
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository';
import { AccountsRepository } from '@/domain/account/repositories/account-repository';
import { AccountMovementsRepository } from '@/domain/account/repositories/account-movement-repository';
import { PrismaAccountBalanceSnapshotRepository } from './prisma/repositories/prisma-account-ballance-repository';
import { PrismaAccountsRepository } from './prisma/repositories/prisma-account.repository';
import { AccountBalanceSnapshotRepository } from '@/domain/account/repositories/account-balance-snapshot-repository'
import { PrismaAccountMovementsRepository } from './prisma/repositories/prisma-account-movement-repository';
import { TwoFactorAutenticationRepository } from '@/domain/application/repositories/two-factor-autentication';
import { PrismaTwoFactorAuthenticationRepository } from './prisma/repositories/prisma-two-factor-autentication-repository';
import { TransactionSplitRepository } from '@/domain/transaction/repositories/transaction-split-repository';
import { PrismaTransactionSplitRepository } from './prisma/repositories/prisma-transaction-split-repository';
import { ReceivableRepository } from '@/domain/transaction/repositories/receivable-repository';
import { PrismaReceivableRepository } from './prisma/repositories/prisma-receivable-repository';
import { PrismaTransactionManager } from './prisma/prisma-transaction-manager';
import { TransactionManager } from '@/core/transaction/transaction-manager';

@Module({
    imports: [EnvModule],
    providers: [
        PrismaService,
        RedisService,

        RedisWhatsAppRepository,
        RedisIdempotencyRepository,
        RedisRateLimitRepository,


        {
            provide: TransactionManager,
            useClass: PrismaTransactionManager
        },
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
            provide: TransactionSplitRepository,
            useClass: PrismaTransactionSplitRepository,
        },
        {
            provide: ReceivableRepository,
            useClass: PrismaReceivableRepository,
        },

        {
            provide: PaymentRepository,
            useClass: PrismaPaymentRepository,
        },
        {
            provide: WhatsAppRepository,
            useClass: PrismaWhatsAppRepository,
        },
        {
            provide: InvoiceRepository,
            useClass: PrismaInvoiceRepository,
        },
        {
            provide: SubscriptionRepository,
            useClass: PrismaSubscriptionRepository,
        },
        {
            provide: NfseRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: AccountsRepository,
            useClass: PrismaAccountsRepository,
        },
        {
            provide: AccountMovementsRepository,
            useClass: PrismaAccountMovementsRepository,
        },
        {
            provide: AccountBalanceSnapshotRepository,
            useClass: PrismaAccountBalanceSnapshotRepository,
        },
        {
            provide: TwoFactorAutenticationRepository,
            useClass: PrismaTwoFactorAuthenticationRepository,
        }
    ],
    exports: [
        PrismaService,
        RedisService,
        TransactionManager,
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
        InvoiceRepository,
        SubscriptionRepository,
        FileRepository,
        EmailRepository,
        TransactionRepository,
        TransactionSplitRepository,
        ReceivableRepository,
        PaymentRepository,
        WhatsAppRepository,
        NfseRepository,
        RedisWhatsAppRepository,
        RedisIdempotencyRepository,
        RedisRateLimitRepository,
        AccountsRepository,
        AccountMovementsRepository,
        AccountBalanceSnapshotRepository,
        TwoFactorAutenticationRepository,
    ],
})
export class DatabaseModule { }