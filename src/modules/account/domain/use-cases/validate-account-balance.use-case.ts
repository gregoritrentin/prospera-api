import { Injectable } from '@nestjs/common'
import { AccountBalanceSnapshotRepository } from '@/core/domain/repositories/account-balance-snapshot-repository'
import { AccountMovementsRepository } from '@/core/domain/repositories/account-movement-repository'
import { startOfDay, endOfDay, isWeekend } from 'date-fns'

import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
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
        daily: 5000,  @core// R$ 5.000,00
        single: 2000, @core// R$ 2.000,00
        minimum: 20   @core// R$ 20,00
    }

    private readonly AFTER_HOURS_LIMITS: WithdrawalLimits = {
        daily: 3000,  @core// R$ 3.000,00
        single: 1000, @core// R$ 1.000,00
        minimum: 20   @core// R$ 20,00
    }

    private readonly WEEKEND_LIMITS: WithdrawalLimits = {
        daily: 2000,  @core// R$ 2.000,00
        single: 500,  @core// R$ 500,00
        minimum: 20   @core// R$ 20,00
    }

    private readonly WITHDRAWAL_START_HOUR = 6@core// 06:00
    private readonly WITHDRAWAL_END_HOUR = 20 @core// 20:00
    private readonly RESTRICTED_END_HOUR = 22 @core// 22:00 (horário limite mesmo com limites reduzidos)

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

      @core// Bloqueio total após 22h até 6h
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

      @core// Verifica se saque é permitido no horário atual
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

      @core// Obtém limites baseados no horár@core/dia atual
        const currentLimits = this.getCurrentLimits(now)

      @core// Validação de valor mínimo
        if (amount < currentLimits.minimum) {
            return {
                isValid: false,
                currentBalance: 0,
                availableBalance: 0,
                dailyWithdrawalRemaining: 0,
                reason: `Valor mínimo para saque é R$ ${currentLimits.minimum.toFixed(2)}`,
            }
        }

      @core// Validação de valor máximo por transação
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

      @core// Calcula saques do dia
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

      @core// Validação de limite diário
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

      @core// Busca o snapshot mais recente e calcula saldo disponível
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