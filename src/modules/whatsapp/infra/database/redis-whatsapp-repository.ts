import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@/infra/database/redis/redis.service';

@Injectable()
export class RedisWhatsAppRepository {
    private readonly prefix = 'whatsapp:';
    private readonly logger = new Logger(RedisWhatsAppRepository.name);

    constructor(private redisService: RedisService) { }

    async getSession(): Promise<string | null> {
        return this.redisService.get(`${this.prefix}session`);
    }

    async setSession(session: string): Promise<void> {
        await this.redisService.set(`${this.prefix}session`, session);
    }

    async getStatus(): Promise<string | null> {
        return this.redisService.get(`${this.prefix}status`);
    }

    async setStatus(status: string): Promise<void> {
        await this.redisService.set(`${this.prefix}status`, status);
    }

    async getQR(): Promise<string | null> {
        return this.redisService.get(`${this.prefix}qr`);
    }

    async setQR(qr: string): Promise<void> {
        await this.redisService.set(`${this.prefix}qr`, qr);
    }

    async clearSession(): Promise<void> {
        await this.redisService.del(`${this.prefix}session`);
    }

    async clearQR(): Promise<void> {
        await this.redisService.del(`${this.prefix}qr`);
    }

    async clearAll(): Promise<void> {
        const keys = [
            `${this.prefix}session`,
            `${this.prefix}status`,
            `${this.prefix}qr`
        ];

        try {
            await Promise.all(keys.map(key => this.redisService.del(key)));
        } catch (error) {
            this.logger.error('Error clearing WhatsApp data:', error);
            throw new Error('Failed to clear WhatsApp data');
        }
    }
}