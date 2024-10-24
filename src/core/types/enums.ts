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

export enum InvoiceStatus {
    CREATED = 'CREATED',
    OPEN = 'OPEN',
    PAID = 'PAID',
    CANCELED = 'CANCELED'
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