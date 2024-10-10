import { BoletoDetails } from '@/domain/transaction/entities/value-objects/boleto-details'
export class BoletoDetailsPresenter {
    static toHttp(boleto: BoletoDetails) {
        return {

            businessId: boleto.businessId.toString(),
            businessName: boleto.businessName,
            personId: boleto.personId.toString(),
            personName: boleto.personName,
            documentType: boleto.documentType,
            description: boleto.description,
            dueDate: boleto.dueDate,
            paymentDate: boleto.paymentDate,
            paymentLimitDate: boleto.paymentLimitDate,
            amount: boleto.amount,
            feeAmount: boleto.feeAmount,
            paymentAmount: boleto.paymentAmount,
            digitableLine: boleto.digitableLine,
            barcode: boleto.barcode,
            pixQrCode: boleto.pixQrCode,
            pixId: boleto.pixId,
            pdfFileId: boleto.pdfFileId?.toString(),
            pdfFileUrl: boleto.pdfFileUrl,
            status: boleto.status,
            createdAt: boleto.createdAt,
            updatedAt: boleto.updatedAt
        }
    }
}