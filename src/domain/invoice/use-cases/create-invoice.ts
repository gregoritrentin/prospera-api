import { Invoice } from "@/domain/invoice/entities/invoice";
import { InvoiceRepository } from "@/domain/invoice/respositories/invoice-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CalculationMode, InvoiceStatus, YesNo } from "@/core/types/enums";

interface CreateInvoiceUseCaseRequest {
  businessId: string;
  personId: string;
  description?: string | null;
  notes?: string | null;
  paymentLink: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paymentDate: Date;
  paymentLimitDate?: Date | null;
  grossAmount: number;
  discountAmount: number;
  amount: number;
  paymentAmount: number;
  protestMode: YesNo;
  protestDays: number;
  lateMode: CalculationMode;
  lateValue: number;
  interestMode: CalculationMode;
  interestDays: number;
  interestValue: number;
  discountMode: CalculationMode;
  discountDays: number;
  discountValue: number;
}

type CreateInvoiceUseCaseResponse = Either<
  null,
  {
    invoice: Invoice;
  }
>;

@Injectable()
export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute({
    businessId,
    personId,
    description,
    notes,
    paymentLink,
    status,
    issueDate,
    dueDate,
    paymentDate,
    paymentLimitDate,
    grossAmount,
    discountAmount,
    amount,
    paymentAmount,
    protestMode,
    protestDays,
    lateMode,
    lateValue,
    interestMode,
    interestDays,
    interestValue,
    discountMode,
    discountDays,
    discountValue,
  }: CreateInvoiceUseCaseRequest): Promise<CreateInvoiceUseCaseResponse> {
    const invoice = Invoice.create({
      businessId: new UniqueEntityID(businessId),
      personId: new UniqueEntityID(personId),
      description,
      notes,
      paymentLink,
      status,
      issueDate,
      dueDate,
      paymentDate,
      paymentLimitDate,
      grossAmount,
      discountAmount,
      amount,
      paymentAmount,
      protestMode,
      protestDays,
      lateMode,
      lateValue,
      interestMode,
      interestDays,
      interestValue,
      discountMode,
      discountDays,
      discountValue,
    });

    await this.invoiceRepository.create(invoice);

    return right({
      invoice,
    });
  }
}
