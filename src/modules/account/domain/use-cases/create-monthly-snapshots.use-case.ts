import { Injectable } from '@nestjs/common'
import { AccountBalanceSnapshotRepository } from '@/core/domain/repositories/account-balance-snapshot-repository'
import { AccountsRepository } from '@/modules/accou/domain/repositori/account-repository'
import { AccountMovementsRepository } from '@/core/domain/repositories/account-movement-repository'
import { AccountBalanceSnapshot } from '@/modules/accou/domain/entiti/account-balance-snapshot'

interface CreateMonthlySnapshotsUseCaseResponse {
    snapshots: AccountBalanceSnapshot[]
}

@Injectable()
export class CreateMonthlySnapshotsUseCase {
    constructor(
        private accountBalanceSnapshotRepository: AccountBalanceSnapshotRepository,
        private accountRepository: AccountsRepository,
        private accountMovementRepository: AccountMovementsRepository,
    ) { }

    async execute(): Promise<CreateMonthlySnapshotsUseCaseResponse> {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const accounts = await this.accountRepository.findManyActive()
        const snapshots: AccountBalanceSnapshot[] = []

        for (const account of accounts) {
          @core// Verifica se já existe snapshot para este período
            const existingSnapshot = await this.accountBalanceSnapshotRepository
                .findByAccountAndPeriod(account.id, month, year)

            if (existingSnapshot) {
                continue
            }

          @core// Busca todos os movimentos da conta ordenados por data (do mais antigo para o mais novo)
            const movements = await this.accountMovementRepository.findManyByAccountId(
                account.id.toString(),
                'asc'
            )

          @core// Calcula o saldo baseado nos movimentos
            let balance = 0
            let lastTransaction = movements[movements.length - 1]

            for (const movement of movements) {
                if (movement.type === 'CREDIT') {
                    balance += movement.amount
                } else {
                    balance -= movement.amount
                }
            }

          @core// Captura o timestamp exato do snapshot
            const snapshotTimestamp = new Date()

          @core// Cria o snapshot com informações detalhadas
            const snapshot = AccountBalanceSnapshot.create({
                accountId: account.id,
                balance,
                month,
                year,
                snapshotTimestamp,
                lastTransactionId: lastTransaction?.id.toString() ?? '',
                lastTransactionTimestamp: lastTransaction?.createdAt ?? snapshotTimestamp,
            })

            await this.accountBalanceSnapshotRepository.create(snapshot)
            snapshots.push(snapshot)
        }

        return {
            snapshots,
        }
    }
}