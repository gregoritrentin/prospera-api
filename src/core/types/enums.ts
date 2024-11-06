//GENERAL
export enum YesNo {
    YES = 'YES',
    NO = 'NO'
}

enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

//USER
export enum UserGender {
    MALE = 'MALE',
    FEMAILE = 'FEMAILE',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
}

//FINANCE
export enum CalculationMode {
    NONE = 'NONE',
    PERCENT = 'PERCENT',
    VALUE = 'VALUE'
}

export enum SplitType {
    FIXED = 'FIXED',
    PERCENT = 'PERCENT'
}

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    OPEN = 'OPEN',
    PAID = 'PAID',
    CANCELED = 'CANCELED',
}

export enum PaymentType {
    PIX_KEY = 'PIX_KEY',
    PIX_BANK_DETAILS = 'PIX_BANK_DETAILS',
}

export enum TransactionType {
    BOLETO = 'BOLETO',
    PIX = 'PIX',
    CARD = 'CARD',
}

export enum MovementType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    CASH = 'CASH',
    BOLETO = 'BOLETO',
    PIX = 'PIX'
}

export enum SaleStatus {
    DRAFT = 'DRAFT',
    CREDIT_ANALYSIS = 'CREDIT_ANALYSIS',
    APPROVED = 'APPROVED',
    CREDIT_DENIED = 'CREDIT_DENIED',
    WAITING_PREPAYMENT = 'WAITING_PREPAYMENT',
    PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED_TO_INVOICE = 'APPROVED_TO_INVOICE',
    INVOICED = 'INVOICED',
    CANCELED = 'CANCELED',
    RETURNED = 'RETURNED'
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PASTDUE = 'PASTDUE',
    SUSPENDED = 'SUSPENDED',
    CANCELED = 'CANCELED'
}
