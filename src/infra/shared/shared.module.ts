// src/infra/shared/shared.module.ts

import { Module } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

const QUEUE_CONFIG: Record<string, BullModuleOptions> = {
    email: {
        name: 'email',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    boleto: {
        name: 'boleto',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    invoice: {
        name: 'invoice',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    'subscription-invoice': {
        name: 'subscription-invoice',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    nfse: {
        name: 'nfse',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            }
        }
    },
    'invoice-notifications': {
        name: 'invoice-notifications',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            }
        }
    }
};

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get('REDIS_URL'),
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                },
                settings: {
                    stalledInterval: 30000,
                    maxStalledCount: 3,
                }
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue(...(Object.values(QUEUE_CONFIG) as BullModuleOptions[])),
    ],
    exports: [
        BullModule
    ]
})
export class SharedModule { }