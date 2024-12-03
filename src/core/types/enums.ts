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







// NFSe Status
export enum NfseStatus {
    DRAFT = 'DRAFT',               // Em elaboração
    AUTHORIZED = 'AUTHORIZED',     // NFSe Autorizada/Emitida
    CANCELED = 'CANCELED',         // NFSe Cancelada
    PENDING = 'PENDING',           // Aguardando processamento
    ERROR = 'ERROR',               // Erro de processamento
    REPLACED = 'REPLACED',         // NFSe Substituída
    PROCESSING = 'PROCESSING',     // Em Processamento
    REJECTED = 'REJECTED',         // NFSe Rejeitada
}

// RPS Types
export enum RpsType {
    RPS = 'RPS',                   // Recibo Provisório de Serviços
    NFCONJUGADA = 'NFCONJUGADA',  // Nota Fiscal Conjugada
    CUPOM = 'CUPOM',              // Cupom Fiscal
}

// NFSe Event Types
export enum NfseEventType {
    ISSUANCE = 'ISSUANCE',           // Emissão
    CANCELLATION = 'CANCELLATION',    // Cancelamento
    QUERY = 'QUERY',                 // Consulta
    REPLACEMENT = 'REPLACEMENT',      // Substituição
    AUTHORIZATION = 'AUTHORIZATION',  // Autorização
    REJECTION = 'REJECTION',         // Rejeição
    PROCESSING = 'PROCESSING',       // Processamento
    BATCH_PROCESSING = 'BATCH_PROCESSING', // Processamento em Lote
    ERROR_CORRECTION = 'ERROR_CORRECTION', // Correção de Erro
    STATUS_UPDATE = 'STATUS_UPDATE',  // Atualização de Status
}

// Event Status
export enum NfseEventStatus {
    SUCCESS = 'SUCCESS',     // Sucesso
    ERROR = 'ERROR',        // Erro
    WARNING = 'WARNING',    // Alerta
    PENDING = 'PENDING',    // Pendente
    TIMEOUT = 'TIMEOUT',    // Timeout
    PARTIAL = 'PARTIAL',    // Parcial
}

// ABRASF Versions
export enum AbrasfVersion {
    V1_0 = 'v10',          // Versão 1.0
    V2_04 = 'v204',       // Versão 2.04
}

// ISS Requirement
export enum IssRequirement {
    EXIGIVEL = 'EXIGIVEL',                        // Exigível
    ISENTO = 'ISENTO',                           // Isento
    IMUNE = 'IMUNE',                            // Imune
    EXPORTACAO = 'EXPORTACAO',                   // Exportação
    SUSPENSO_DECISAO_JUDICIAL = 'SUSPENSO_DECISAO_JUDICIAL',         // Suspenso por Decisão Judicial
    SUSPENSO_PROCESSO_ADMIN = 'SUSPENSO_PROCESSO_ADMIN',    // Suspenso por Processo Administrativo
}

// Operation Type (Natureza da Operação)
export enum OperationType {
    TAXATION_IN_CITY = 'TAXATION_IN_CITY',             // Tributação no município
    TAXATION_OUT_CITY = 'TAXATION_OUT_CITY',           // Tributação fora do município
    EXEMPTION = 'EXEMPTION',                           // Isenção
    IMMUNE = 'IMMUNE',                                 // Imune
    SUSPENDED_JUDICIAL = 'SUSPENDED_JUDICIAL',         // Suspenso por decisão judicial
    SUSPENDED_ADMINISTRATIVE = 'SUSPENDED_ADMINISTRATIVE', // Suspenso por processo administrativo
}

// Substitute Reason
export enum NfseSubstituteReason {
    REGISTRATION_ERROR = 'REGISTRATION_ERROR',  // Erro de cadastro
    VALUE_ERROR = 'VALUE_ERROR',               // Erro de valor
    SERVICE_ERROR = 'SERVICE_ERROR',           // Erro de serviço
    OTHER = 'OTHER',                          // Outros
}

// Cancel Reason
export enum NfseCancelReason {
    DUPLICATE_EMISSION = 'DUPLICATE_EMISSION',  // Emissão em duplicidade
    FILLING_ERROR = 'FILLING_ERROR',           // Erro de preenchimento
    SERVICE_NOT_PROVIDED = 'SERVICE_NOT_PROVIDED', // Serviço não prestado
    FRAUD = 'FRAUD',                           // Fraude
    OTHER = 'OTHER',                          // Outros
}

// Service Codes
export enum ServiceCode {
    // Exemplos de códigos mais comuns
    DEVELOPMENT = '01.01',           // Desenvolvimento de sistemas
    SUPPORT = '01.03',              // Suporte técnico
    HOSTING = '01.08',              // Hospedagem
    CONSULTING = '17.01',           // Consultoria
    TRAINING = '08.02',             // Treinamento
    // Adicionar outros códigos conforme necessário
}