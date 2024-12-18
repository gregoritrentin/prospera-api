import { Injectable } from '@nestjs/common'
import { AccountBalanceSnapshotRepository } from '../repositories/account-balance-snapshot-repository'
import { AccountMovementsRepository } from '../repositories/account-movement-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { startOfDay, endOfDay, isWeekend } from 'date-fns'

interface ValidateAccountBalanceRequest {
    accountId: string
    amount: number
}

interface ValidateAccountBalanceResponse {
    isValid: boolean
    currentBalance: number
    availableBalance: number
    dailyWithdrawalRemaining: number
    reason?: string
}

interface WithdrawalLimits {
    daily: number
    single: number
    minimum: number
}

@Injectable()
export class ValidateAccountBalanceUseCase {
    private readonly BUSINESS_HOURS_LIMITS: WithdrawalLimits = {
        daily: 5000,    // R$ 5.000,00
        single: 2000,   // R$ 2.000,00
        minimum: 20     // R$ 20,00
    }

    private readonly AFTER_HOURS_LIMITS: WithdrawalLimits = {
        daily: 3000,    // R$ 3.000,00
        single: 1000,   // R$ 1.000,00
        minimum: 20     // R$ 20,00
    }

    private readonly WEEKEND_LIMITS: WithdrawalLimits = {
        daily: 2000,    // R$ 2.000,00
        single: 500,    // R$ 500,00
        minimum: 20     // R$ 20,00
    }

    private readonly WITHDRAWAL_START_HOUR = 6  // 06:00
    private readonly WITHDRAWAL_END_HOUR = 20   // 20:00
    private readonly RESTRICTED_END_HOUR = 22   // 22:00 (horário limite mesmo com limites reduzidos)

    constructor(
        private accountBalanceSnapshotRepository: AccountBalanceSnapshotRepository,
        private accountMovementRepository: AccountMovementsRepository,
    ) { }

    private getCurrentLimits(date: Date): WithdrawalLimits {
        const hour = date.getHours()
        const isAfterHours = hour >= this.WITHDRAWAL_END_HOUR || hour < this.WITHDRAWAL_START_HOUR

        if (isWeekend(date)) {
            return this.WEEKEND_LIMITS
        }

        if (isAfterHours) {
            return this.AFTER_HOURS_LIMITS
        }

        return this.BUSINESS_HOURS_LIMITS
    }

    private isWithdrawalAllowed(date: Date): { allowed: boolean; reason?: string } {
        const hour = date.getHours()

        // Bloqueio total após 22h até 6h
        if (hour >= this.RESTRICTED_END_HOUR || hour < this.WITHDRAWAL_START_HOUR) {
            return {
                allowed: false,
                reason: `Saques não permitidos entre ${this.RESTRICTED_END_HOUR}:00 e ${this.WITHDRAWAL_START_HOUR}:00`,
            }
        }

        return { allowed: true }
    }

    async execute({
        accountId,
        amount,
    }: ValidateAccountBalanceRequest): Promise<ValidateAccountBalanceResponse> {
        const now = new Date()

        // Verifica se saque é permitido no horário atual
        const withdrawalPermission = this.isWithdrawalAllowed(now)
        if (!withdrawalPermission.allowed) {
            return {
                isValid: false,
                currentBalance: 0,
                availableBalance: 0,
                dailyWithdrawalRemaining: 0,
                reason: withdrawalPermission.reason,
            }
        }

        // Obtém limites baseados no horário/dia atual
        const currentLimits = this.getCurrentLimits(now)

        // Validação de valor mínimo
        if (amount < currentLimits.minimum) {
            return {
                isValid: false,
                currentBalance: 0,
                availableBalance: 0,
                dailyWithdrawalRemaining: 0,
                reason: `Valor mínimo para saque é R$ ${currentLimits.minimum.toFixed(2)}`,
            }
        }

        // Validação de valor máximo por transação
        if (amount > currentLimits.single) {
            return {
                isValid: false,
                currentBalance: 0,
                availableBalance: 0,
                dailyWithdrawalRemaining: 0,
                reason: `Valor máximo por saque ${isWeekend(now) ? 'aos fins de semana' :
                    now.getHours() >= this.WITHDRAWAL_END_HOUR ? 'após às 20:00' :
                        ''} é R$ ${currentLimits.single.toFixed(2)}`,
            }
        }

        // Calcula saques do dia
        const todayStart = startOfDay(now)
        const todayEnd = endOfDay(now)

        const todayWithdrawals = await this.accountMovementRepository
            .findManyByAccountId(accountId)
            .then(movements => movements.filter(movement =>
                movement.type === 'DEBIT' &&
                movement.createdAt >= todayStart &&
                movement.createdAt <= todayEnd
            ))

        const todayWithdrawalsTotal = todayWithdrawals.reduce(
            (total, movement) => total + movement.amount,
            0
        )

        // Validação de limite diário
        if (todayWithdrawalsTotal + amount > currentLimits.daily) {
            return {
                isValid: false,
                currentBalance: 0,
                availableBalance: 0,
                dailyWithdrawalRemaining: currentLimits.daily - todayWithdrawalsTotal,
                reason: `Limite diário ${isWeekend(now) ? 'aos fins de semana' :
                    now.getHours() >= this.WITHDRAWAL_END_HOUR ? 'após às 20:00' :
                        ''} excedido. Disponível: R$ ${(currentLimits.daily - todayWithdrawalsTotal).toFixed(2)}`,
            }
        }

        // Busca o snapshot mais recente e calcula saldo disponível
        const latestSnapshot = await this.accountBalanceSnapshotRepository
            .findLatestByAccount(new UniqueEntityID(accountId))

        const lastSnapshotDate = latestSnapshot
            ? new Date(latestSnapshot.year, latestSnapshot.month - 1)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1)

        const recentMovements = await this.accountMovementRepository
            .findManyByAccountId(accountId)

        const baseBalance = latestSnapshot?.balance ?? 0
        const recentBalance = recentMovements.reduce((total, movement) => {
            if (movement.createdAt < lastSnapshotDate) {
                return total
            }
            return movement.type === 'CREDIT'
                ? total + movement.amount
                : total - movement.amount
        }, baseBalance)

        const availableBalance = recentBalance
        const isValid = availableBalance >= amount

        return {
            isValid,
            currentBalance: recentBalance,
            availableBalance,
            dailyWithdrawalRemaining: currentLimits.daily - todayWithdrawalsTotal,
            reason: isValid ? undefined : 'Saldo insuficiente',
        }
    }
}