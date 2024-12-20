import { TransactionDetails } from '@/domain/transaction/entities/value-objects/transaction-details'
export class TransactionPixDetailsPresenter {
    static toHttp(pix: TransactionDetails) {
        return {

            businessId: pix.businessId.toString(),
            businessName: pix.businessName,
            personId: pix.personId?.toString() ?? '',
            personName: pix.personName,
            //documentType: pix.documentType,
            description: pix.description,
            dueDate: pix.dueDate,
            paymentDate: pix.paymentDate,
            paymentLimitDate: pix.paymentLimitDate,
            amount: pix.amount,
            feeAmount: pix.feeAmount,
            paymentAmount: pix.paymentAmount,
            pixQrCode: pix.pixQrCode,
            pixId: pix.pixId,
            status: pix.status,
            createdAt: pix.createdAt,
            updatedAt: pix.updatedAt
        }
    }
}