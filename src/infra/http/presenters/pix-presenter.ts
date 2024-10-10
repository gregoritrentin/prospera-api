import { Pix } from '@/domain/transaction/entities/pix'
import { PixDetails } from '@/domain/transaction/entities/value-objects/pix-details'
export class PixPresenter {
    static toHttp(pix: PixDetails) {
        return {

            businessId: pix.businessId.toString(),
            personId: pix.personId?.toString() ?? '',
            personName: pix.personName,
            documentType: pix.documentType,
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