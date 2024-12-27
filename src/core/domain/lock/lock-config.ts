// src/core/lock/lock-config.ts
export interface LockConfig {
    ttl: number            // Tempo de vida do lock em ms
    retries: number        // Número de tentativas
    retryDelay: number     // Delay entre tentativas em ms
    prefix: string         // Prefixo para as keys no Redis
    heartbeatInterval: number  // Intervalo para renovar locks ativos
}

export const DEFAULT_LOCK_CONFIG: LockConfig = {
    ttl: 30000,        // 30 segundos
    retries: 3,        // 3 tentativas
    retryDelay: 1000,  // 1 segundo entre tentativas
    prefix: 'lock:',
    heartbeatInterval: 10000, // 10 segundos
}