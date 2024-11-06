// import { Injectable } from "@nestjs/common";
// import { SalesRepository } from "../repositories/sales-repository";
// import { I18nService, Language } from "@/i18n/i18n.service";
// import { AppError } from "@/core/errors/app-errors";
// import { Either, right } from "@/core/either";
// import { Sale } from "../entities/sale";
// import { SaleStatus } from "@/core/types/enums";


// @Injectable()
// export class AnalyzeSaleCreditUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         //private customerCreditService: CustomerCreditService,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: { saleId: string },
//         language: Language = 'en-US'
//     ): Promise<Either<AppError, { sale: Sale }>> {
//         // 1. Buscar a venda
//         const sale = await this.salesRepository.findById(request.saleId);

//         if (!sale) {
//             return left(new AppError('errors.SALE_NOT_FOUND'));
//         }

//         // 2. Validar status atual
//         if (sale.status !== SaleStatus.DRAFT) {
//             return left(new AppError('errors.INVALID_STATUS_FOR_CREDIT_ANALYSIS'));
//         }

//         try {
//             // 3. Mudar para análise de crédito
//             sale.status = SaleStatus.CREDIT_ANALYSIS;
//             await this.salesRepository.save(sale);

//             // 4. Realizar análise de crédito
//             const creditAnalysis = await this.customerCreditService.analyze(
//                 sale.customerId,
//                 sale.amount
//             );

//             // 5. Atualizar status baseado na análise
//             sale.status = creditAnalysis.approved
//                 ? SaleStatus.APPROVED
//                 : SaleStatus.CREDIT_DENIED;

//             await this.salesRepository.save(sale);

//             return right({ sale });

//         } catch (error) {
//             // 6. Em caso de erro, voltar para DRAFT
//             sale.status = SaleStatus.DRAFT;
//             await this.salesRepository.save(sale);

//             return left(new AppError('errors.CREDIT_ANALYSIS_FAILED'));
//         }
//     }
// }