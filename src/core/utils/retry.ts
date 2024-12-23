// src/core/utils/retry.ts
interface RetryOptions {
    attempts: number
    delay: number
    exponential: boolean
    onRetry?: (error: any, attempt: number) => void
}

const defaultOptions: RetryOptions = {
    attempts: 3,
    delay: 1000,
    exponential: true
}

export async function retry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const opts = { ...defaultOptions, ...options }
    let lastError: any

    for (let attempt = 1; attempt <= opts.attempts; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error

            if (attempt === opts.attempts) {
                throw error
            }

            if (opts.onRetry) {
                opts.onRetry(error, attempt)
            }

            const delay = opts.exponential
                ? opts.delay * Math.pow(2, attempt - 1)
                : opts.delay

            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    throw lastError
}