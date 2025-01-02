import { Transaction } from '@/modules/transaction/domain/entities/transaction'

export class TransactionBoletoPresenter {
    static toHttp(transaction: Transaction) {
        return {
            id: transaction.id.toString(),
            businessId: transaction.businessId.toString(),
            personId: transaction.personId?.toString() ?? null,
            description: transaction.description,
            status: transaction.status,
            type: transaction.type,
            dueDate: transaction.dueDate,
            paymentDate: transaction.paymentDate,
            paymentLimitDate: transaction.paymentLimitDate,
            amount: transaction.amount,
            feeAmount: transaction.feeAmount,
            paymentAmount: transaction.paymentAmount,
            ourNumber: transaction.ourNumber,
            digitableLine: transaction.digitableLine,
            barcode: transaction.barcode,
            pixQrCode: transaction.pixQrCode,
            pixId: transaction.pixId,
            fileId: transaction.fileId?.toString(),
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
        }
    }
}