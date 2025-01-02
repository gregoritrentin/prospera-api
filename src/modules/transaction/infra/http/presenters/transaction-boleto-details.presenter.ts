import { TransactionDetails } from '@/modules/transaction/domain/entities/value-objects/transaction-details'

export class BoletoDetailsPresenter {
    static toHttp(boleto: TransactionDetails) {
        return {

            businessId: boleto.businessId.toString(),
            businessName: boleto.businessName,
            boletoId: boleto.id.toString(),
            personId: boleto.personId?.toString() ?? null,
            personName: boleto.personName,
            description: boleto.description,
            dueDate: boleto.dueDate,
            paymentDate: boleto.paymentDate,
            paymentLimitDate: boleto.paymentLimitDate,
            amount: boleto.amount,
            feeAmount: boleto.feeAmount,
            paymentAmount: boleto.paymentAmount,
            digitableLine: boleto.digitableLine,
            ourNumber: boleto.ourNumber,
            //yourNumber: boleto.yourNumber,
            barcode: boleto.barcode,
            pixQrCode: boleto.pixQrCode,
            pixId: boleto.pixId,
            fileId: boleto.fileId?.toString(),
            //fileUrl: boleto.fileUrl,
            status: boleto.status,
            createdAt: boleto.createdAt,
            updatedAt: boleto.updatedAt
        }
    }
}