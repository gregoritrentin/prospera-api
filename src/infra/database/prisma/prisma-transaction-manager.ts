import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionManager } from '@/core/transaction/transaction-manager'

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
    constructor(private prisma: PrismaService) { }

    async start<T>(callback: () => Promise<T>): Promise<T> {
        return this.prisma.$transaction(callback);
    }
}