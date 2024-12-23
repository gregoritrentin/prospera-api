import { Injectable, Logger, Optional } from '@nestjs/common'
import { RedisService } from '@/infra/database/redis/redis.service'
import { LockManager } from '@/core/lock/lock-manager'
import { randomUUID } from 'crypto'
import { LockConfig, DEFAULT_LOCK_CONFIG } from '@/core/lock/lock-config'
import { AppError } from '@/core/errors/app-errors'

@Injectable()
export class RedisLockRepository implements LockManager {
    private readonly logger = new Logger(RedisLockRepository.name)
    private readonly lockOwners = new Map<string, string>()
    private readonly heartbeats = new Map<string, NodeJS.Timeout>()
    private readonly config: LockConfig
    private readonly ACQUIRE_TIMEOUT = 10000 // 10 segundos

    constructor(
        private redis: RedisService,
        @Optional() config?: Partial<LockConfig>
    ) {
        this.config = {
            ...DEFAULT_LOCK_CONFIG,
            ...config
        }
    }

    private getLockKey(key: string): string {
        return `${this.config.prefix}${key}`
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private async startHeartbeat(key: string): Promise<void> {
        if (this.heartbeats.has(key)) {
            return
        }

        const interval = setInterval(async () => {
            try {
                const extended = await this.extend(key)
                if (!extended) {
                    this.stopHeartbeat(key)
                    this.lockOwners.delete(key)
                    throw AppError.lockHeartbeatFailed({ key })
                }
            } catch (error) {
                if (error instanceof AppError) {
                    this.logger.error(error.message, error.details)
                }
                this.stopHeartbeat(key)
                this.lockOwners.delete(key)
            }
        }, this.config.heartbeatInterval)

        this.heartbeats.set(key, interval)
    }

    private stopHeartbeat(key: string): void {
        const interval = this.heartbeats.get(key)
        if (interval) {
            clearInterval(interval)
            this.heartbeats.delete(key)
        }
    }

    async acquire(key: string, ttl: number = this.config.ttl): Promise<boolean> {
        const lockKey = this.getLockKey(key)
        const lockId = randomUUID()
        let attempts = 0
        const startTime = Date.now()

        while (attempts < this.config.retries) {
            if (Date.now() - startTime > this.ACQUIRE_TIMEOUT) {
                this.logger.warn(`Lock acquisition timeout for key: ${key}`)
                throw AppError.lockTimeout({ key, timeout: this.ACQUIRE_TIMEOUT })
            }

            try {
                const exists = await this.redis.exists(lockKey)
                if (exists) {
                    throw AppError.lockAlreadyExists({ key })
                }

                const acquired = await this.redis.set(
                    lockKey,
                    lockId,
                    'PX',
                    ttl,
                    'NX'
                )

                if (acquired === 'OK') {
                    this.lockOwners.set(key, lockId)
                    this.startHeartbeat(key)
                    this.logger.debug(`Lock acquired: ${key} (attempt ${attempts + 1})`)
                    return true
                }

                this.logger.debug(`Lock attempt failed: ${key} (attempt ${attempts + 1})`)
                attempts++

                if (attempts < this.config.retries) {
                    await this.sleep(this.config.retryDelay)
                }
            } catch (error) {
                if (error instanceof AppError) throw error

                this.logger.error(
                    `Error acquiring lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    error instanceof Error ? error.stack : undefined
                )
                attempts++

                if (attempts === this.config.retries) {
                    throw AppError.lockAcquisitionFailed({
                        key,
                        attempts,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    })
                }

                await this.sleep(this.config.retryDelay)
            }
        }

        throw AppError.lockAcquisitionFailed({
            key,
            attempts,
            reason: 'Max retries exceeded'
        })
    }

    async release(key: string): Promise<void> {
        const lockKey = this.getLockKey(key)
        const lockId = this.lockOwners.get(key)

        if (!lockId) {
            throw AppError.lockNotFound({ key })
        }

        try {
            const script = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
            `

            const result = await this.redis.eval(script, 1, lockKey, lockId)
            if (result === 0) {
                throw AppError.lockNotFound({ key })
            }

            this.lockOwners.delete(key)
            this.stopHeartbeat(key)
            this.logger.debug(`Lock released: ${key}`)
        } catch (error) {
            if (error instanceof AppError) throw error

            throw AppError.lockReleaseFailed({
                key,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async extend(key: string, ttl: number = this.config.ttl): Promise<boolean> {
        const lockKey = this.getLockKey(key)
        const lockId = this.lockOwners.get(key)

        if (!lockId) {
            throw AppError.lockNotFound({ key })
        }

        try {
            const script = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("pexpire", KEYS[1], ARGV[2])
                else
                    return 0
                end
            `

            const result = await this.redis.eval(
                script,
                1,
                lockKey,
                lockId,
                ttl.toString()
            )

            if (result === 0) {
                throw AppError.lockNotFound({ key })
            }

            this.logger.debug(`Lock extended: ${key}`)
            return true
        } catch (error) {
            if (error instanceof AppError) throw error

            throw AppError.lockExtendFailed({
                key,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async cleanup(): Promise<void> {
        try {
            const keys = Array.from(this.lockOwners.keys())
            for (const key of keys) {
                const lockKey = this.getLockKey(key)
                const exists = await this.redis.exists(lockKey)

                if (!exists) {
                    this.lockOwners.delete(key)
                    this.stopHeartbeat(key)
                    this.logger.warn(`Cleaned up orphaned lock: ${key}`)
                }
            }
        } catch (error) {
            throw AppError.lockCleanupFailed({
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}