import { Module } from '@nestjs/common'
import { EnvModule } from '../config/env.module'
import { TransactionManager } from '@/core/transaction/transaction-manager'
import { LockManager } from '@/core/lock/lock-manager'
import { PrismaService } from './prisma/prisma.service'
import { RedisService } from './redis/redis.service'
import { PrismaTransactionManager } from './prisma/prisma-transaction-manager'
import { RedisLockRepository } from './redis/repositories/redis-lock-repository'
import { RedisWhatsAppRepository } from './redis/repositories/redis-whatsapp-repository'
import { RedisIdempotencyRepository } from './redis/repositories/redis-idempotency-repository'
import { RedisRateLimitRepository } from './redis/repositories/redis-rate-limit-repository'
import { BusinessRepository } from '@/modules/application/domain/repositories/business-repository'
import { PrismaBusinessRepository } from './prisma/repositories/prisma-business-repository'
import { BusinessOwnerRepository } from '@/modules/application/domain/repositories/business-owner-repository'
import { PrismaBusinessOwnerRepository } from './prisma/repositories/prisma-business-owner-repository'
import { BusinessAppRepository } from '@/modules/application/domain/repositories/business-app-repository'
import { PrismaBusinessAppRepository } from './prisma/repositories/prisma-business-app-repository'
import { AppRepository } from '@/modules/application/domain/repositories/app-repository'
import { PrismaAppRepository } from './prisma/repositories/prisma-app-repository'
import { MarketplaceRepository } from '@/modules/application/domain/repositories/marketplace-repository'
import { PrismaMarketplaceRepository } from './prisma/repositories/prisma-marketplace-repository'
import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'
import { UserBusinessRepository } from '@/modules/application/domain/repositories/user-business-repository'
import { PrismaUserBusinessRepository } from './prisma/repositories/prisma-user-business-repository'
import { UserTermRepository } from '@/modules/application/domain/repositories/user-term-repository'
import { PrismaUserTermRepository } from './prisma/repositories/prisma-user-term-repository'
import { TermRepository } from '@/modules/application/domain/repositories/term-repository'
import { PrismaTermRepository } from './prisma/repositories/prisma-term-repository'
import { TwoFactorAutenticationRepository } from '@/modules/application/domain/repositories/two-factor-autentication'
import { PrismaTwoFactorAuthenticationRepository } from './prisma/repositories/prisma-two-factor-autentication-repository'
import { PersonsRepository } from '@/modules/person/domain/repositories/persons-repository'
import { PrismaPersonsRepository } from './prisma/repositories/prisma-person-repository'
import { ItemRepository } from '@/modules/item/domain/repositories/item-repository'
import { PrismaItemRepository } from './prisma/repositories/prisma-item-repository'
import { ItemGroupRepository } from '@/modules/item/domain/repositories/item-group-repository'
import { PrismaItemGroupRepository } from './prisma/repositories/prisma-item-group-repository'
import { ItemTaxationRepository } from '@/modules/item/domain/repositories/item-taxation-repository'
import { PrismaItemTaxationRepository } from './prisma/repositories/prisma-item-taxation-repository'
import { AccountsRepository } from '@/modules/account/domain/repositories/account-repository'
import { PrismaAccountsRepository } from './prisma/repositories/prisma-account.repository'
import { AccountMovementsRepository } from '@/modules/account/domain/repositories/account-movement-repository'
import { PrismaAccountMovementsRepository } from './prisma/repositories/prisma-account-movement-repository'
import { AccountBalanceSnapshotRepository } from '@/modules/account/domain/repositories/account-balance-snapshot-repository'
import { PrismaAccountBalanceSnapshotRepository } from './prisma/repositories/prisma-account-ballance-repository'
import { TransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'
import { TransactionSplitRepository } from '@/modules/transaction/domain/repositories/transaction-split-repository'
import { PrismaTransactionSplitRepository } from './prisma/repositories/prisma-transaction-split-repository'
import { ReceivableRepository } from '@/modules/transaction/domain/repositories/receivable-repository'
import { PrismaReceivableRepository } from './prisma/repositories/prisma-receivable-repository'
import { PaymentRepository } from '@/modules/payment/domain/repositories/payment-repository'
import { PrismaPaymentRepository } from './prisma/repositories/prisma-payment-pix-repository'
import { WhatsAppRepository } from '@/modules/whatsapp/domain/repositories/whatsapp-repository'
import { PrismaWhatsAppRepository } from './prisma/repositories/prisma-whatsapp-repository'
import { EmailRepository } from '@/modules/email/domain/repositories/email-repository'
import { PrismaEmailRepository } from './prisma/repositories/prisma-email-repository'
import { FileRepository } from '@/modules/file/domain/repository/file-repository'
import { PrismaFilesRepository } from './prisma/repositories/prisma-file-repository'
import { InvoiceRepository } from '@/modules/invoice/domain/respositories/invoice-repository'
import { PrismaInvoiceRepository } from './prisma/repositories/prisma-invoice-repository'
import { NfseRepository } from '@/modules/dfe/domain/nfse/repositories/nfse-repository'
import { SubscriptionRepository } from '@/modules/subscription/domain/repositories/subscription-repository'
import { PrismaSubscriptionRepository } from './prisma/repositories/prisma-subscription-repository'
import { RedisMetricRepository } from './redis/repositories/redis-metric-repository'
import { MetricRepository } from '@/modules/metric/domain/repository/metric-repository'
import { ValidateAccountBalanceUseCase } from '@/modules/account/domain/use-cases/validate-account-balance'
import { CreateAccountMovementUseCase } from '@/modules/account/domain/use-cases/create-account-movement'
import { RecordTransactionMetricUseCase } from '@/modules/metric/domain/use-case/record-transaction-metrics'

@Module({
    imports: [EnvModule],
    providers: [
        // Core Services
        PrismaService,
        RedisService,
        {
            provide: TransactionManager,
            useClass: PrismaTransactionManager
        },
        {
            provide: LockManager,
            useClass: RedisLockRepository
        },

        // Redis Repositories
        RedisWhatsAppRepository,
        RedisIdempotencyRepository,
        RedisRateLimitRepository,
        RedisMetricRepository,

        // Business & Applications
        {
            provide: BusinessRepository,
            useClass: PrismaBusinessRepository,
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
            provide: AppRepository,
            useClass: PrismaAppRepository,
        },
        {
            provide: MarketplaceRepository,
            useClass: PrismaMarketplaceRepository,
        },

        // Users & Authentication
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: UserBusinessRepository,
            useClass: PrismaUserBusinessRepository,
        },
        {
            provide: UserTermRepository,
            useClass: PrismaUserTermRepository,
        },
        {
            provide: TermRepository,
            useClass: PrismaTermRepository,
        },
        {
            provide: TwoFactorAutenticationRepository,
            useClass: PrismaTwoFactorAuthenticationRepository,
        },

        // Persons
        {
            provide: PersonsRepository,
            useClass: PrismaPersonsRepository,
        },

        // Items & Products
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

        // Financial
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

        // Transactions & Payments
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

        // Communications
        {
            provide: WhatsAppRepository,
            useClass: PrismaWhatsAppRepository,
        },
        {
            provide: EmailRepository,
            useClass: PrismaEmailRepository,
        },

        // Documents & Files
        {
            provide: FileRepository,
            useClass: PrismaFilesRepository,
        },
        {
            provide: InvoiceRepository,
            useClass: PrismaInvoiceRepository,
        },
        {
            provide: NfseRepository,
            useClass: PrismaUserRepository,
        },

        // Subscriptions
        {
            provide: SubscriptionRepository,
            useClass: PrismaSubscriptionRepository,
        },
        {
            provide: MetricRepository,
            useClass: RedisMetricRepository,
        },
        // Casos de Uso de Conta (Account)
        ValidateAccountBalanceUseCase,
        CreateAccountMovementUseCase,
        RecordTransactionMetricUseCase,

    ],
    exports: [
        // Core Services
        PrismaService,
        RedisService,
        TransactionManager,
        LockManager,

        // Redis Repositories
        RedisWhatsAppRepository,
        RedisIdempotencyRepository,
        RedisRateLimitRepository,
        RedisMetricRepository,

        // Domain Repositories
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
        AccountsRepository,
        AccountMovementsRepository,
        AccountBalanceSnapshotRepository,
        TwoFactorAutenticationRepository,
        MetricRepository,
        TransactionRepository,


        ValidateAccountBalanceUseCase,
        CreateAccountMovementUseCase,
        RecordTransactionMetricUseCase,
    ],
})
export class DatabaseModule { }