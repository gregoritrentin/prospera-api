import { Module } from '@nestjs/common'

// Core/Infraestrutura
import { EnvModule } from '../env/env.module'
import { TransactionManager } from '@/core/transaction/transaction-manager'
import { LockManager } from '@/core/lock/lock-manager'

// Core Services
import { PrismaService } from './prisma/prisma.service'
import { RedisService } from './redis/redis.service'
import { PrismaTransactionManager } from './prisma/prisma-transaction-manager'
import { RedisLockRepository } from './redis/repositories/redis-lock-repository'

// Redis Repositories
import { RedisWhatsAppRepository } from './redis/repositories/redis-whatsapp-repository'
import { RedisIdempotencyRepository } from './redis/repositories/redis-idempotency-repository'
import { RedisRateLimitRepository } from './redis/repositories/redis-rate-limit-repository'

// Domain: Business & Applications
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { PrismaBusinessRepository } from './prisma/repositories/prisma-business-repository'
import { BusinessOwnerRepository } from '@/domain/application/repositories/business-owner-repository'
import { PrismaBusinessOwnerRepository } from './prisma/repositories/prisma-business-owner-repository'
import { BusinessAppRepository } from '@/domain/application/repositories/business-app-repository'
import { PrismaBusinessAppRepository } from './prisma/repositories/prisma-business-app-repository'
import { AppRepository } from '@/domain/application/repositories/app-repository'
import { PrismaAppRepository } from './prisma/repositories/prisma-app-repository'
import { MarketplaceRepository } from '@/domain/application/repositories/marketplace-repository'
import { PrismaMarketplaceRepository } from './prisma/repositories/prisma-marketplace-repository'

// Domain: Users & Authentication
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'
import { UserBusinessRepository } from '@/domain/application/repositories/user-business-repository'
import { PrismaUserBusinessRepository } from './prisma/repositories/prisma-user-business-repository'
import { UserTermRepository } from '@/domain/application/repositories/user-term-repository'
import { PrismaUserTermRepository } from './prisma/repositories/prisma-user-term-repository'
import { TermRepository } from '@/domain/application/repositories/term-repository'
import { PrismaTermRepository } from './prisma/repositories/prisma-term-repository'
import { TwoFactorAutenticationRepository } from '@/domain/application/repositories/two-factor-autentication'
import { PrismaTwoFactorAuthenticationRepository } from './prisma/repositories/prisma-two-factor-autentication-repository'

// Domain: Persons
import { PersonsRepository } from '@/domain/person/repositories/persons-repository'
import { PrismaPersonsRepository } from './prisma/repositories/prisma-person-repository'

// Domain: Items & Products
import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { PrismaItemRepository } from './prisma/repositories/prisma-item-repository'
import { ItemGroupRepository } from '@/domain/item/repositories/item-group-repository'
import { PrismaItemGroupRepository } from './prisma/repositories/prisma-item-group-repository'
import { ItemTaxationRepository } from '@/domain/item/repositories/item-taxation-repository'
import { PrismaItemTaxationRepository } from './prisma/repositories/prisma-item-taxation-repository'

// Domain: Financial
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { PrismaAccountsRepository } from './prisma/repositories/prisma-account.repository'
import { AccountMovementsRepository } from '@/domain/account/repositories/account-movement-repository'
import { PrismaAccountMovementsRepository } from './prisma/repositories/prisma-account-movement-repository'
import { AccountBalanceSnapshotRepository } from '@/domain/account/repositories/account-balance-snapshot-repository'
import { PrismaAccountBalanceSnapshotRepository } from './prisma/repositories/prisma-account-ballance-repository'

// Domain: Transactions & Payments
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'
import { TransactionSplitRepository } from '@/domain/transaction/repositories/transaction-split-repository'
import { PrismaTransactionSplitRepository } from './prisma/repositories/prisma-transaction-split-repository'
import { ReceivableRepository } from '@/domain/transaction/repositories/receivable-repository'
import { PrismaReceivableRepository } from './prisma/repositories/prisma-receivable-repository'
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository'
import { PrismaPaymentRepository } from './prisma/repositories/prisma-payment-pix-repository'

// Domain: Communications
import { WhatsAppRepository } from '@/domain/whatsapp/repositories/whatsapp-repository'
import { PrismaWhatsAppRepository } from './prisma/repositories/prisma-whatsapp-repository'
import { EmailRepository } from '@/domain/email/repositories/email-repository'
import { PrismaEmailRepository } from './prisma/repositories/prisma-email-repository'

// Domain: Documents & Files
import { FileRepository } from '@/domain/file/repository/file-repository'
import { PrismaFilesRepository } from './prisma/repositories/prisma-file-repository'
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository'
import { PrismaInvoiceRepository } from './prisma/repositories/prisma-invoice-repository'
import { NfseRepository } from '@/domain/dfe/nfse/repositories/nfse-repository'

// Domain: Subscriptions
import { SubscriptionRepository } from '@/domain/subscription/repositories/subscription-repository'
import { PrismaSubscriptionRepository } from './prisma/repositories/prisma-subscription-repository'
import { RedisMetricRepository } from './redis/repositories/redis-metric-repository'
import { MetricRepository } from '@/domain/metric/repository/metric-repository'
import { ValidateAccountBalanceUseCase } from '@/domain/account/use-cases/validate-account-balance'
import { CreateAccountMovementUseCase } from '@/domain/account/use-cases/create-account-movement'
import { RecordTransactionMetricUseCase } from '@/domain/metric/use-case/record-transaction-metrics'

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