import { Injectable, Logger } from '@nestjs/common'
import Redis from 'ioredis'
import { EnvService } from '@/infr./config/env.service'

@Injectable()
export class RedisService extends Redis {
    private readonly logger = new Logger(RedisService.name);

    constructor(private envService: EnvService) {
        const redisUrl = envService.get('REDIS_URL');

        super(redisUrl, {
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            connectTimeout: 20000,
        });

        this.logger.log('Attempting to connect to Redis Cloud');

        this.on('error', (error) => {
            this.logger.error(`Redis connection error: ${error.message}`, error.stack);
        });

        this.on('connect', () => {
            this.logger.log('Successfully connected to Redis Cloud');
        });

        this.on('ready', () => {
            this.logger.log('Redis client is ready');
        });

        this.on('end', () => {
            this.logger.warn('Redis connection has ended');
        });
    }
}