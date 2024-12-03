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

export enum ServiceCode {
    // 1 – Serviços de informática e congêneres
    S0101 = "01.01", // Análise e desenvolvimento de sistemas
    S0102 = "01.02", // Programação
    S0103 = "01.03", // Processamento, armazenamento ou hospedagem de dados
    S0104 = "01.04", // Elaboração de programas de computadores
    S0105 = "01.05", // Licenciamento de programas de computação
    S0106 = "01.06", // Assessoria e consultoria em informática
    S0107 = "01.07", // Suporte técnico em informática
    S0108 = "01.08", // Planejamento e atualização de páginas eletrônicas
    S0109 = "01.09", // Disponibilização de conteúdos por internet

    // 2 – Serviços de pesquisas e desenvolvimento
    S0201 = "02.01", // Serviços de pesquisas e desenvolvimento

    // 3 – Serviços de locação e cessão
    S0302 = "03.02", // Cessão de direito de uso de marcas
    S0303 = "03.03", // Exploração de salões de festas e congêneres
    S0304 = "03.04", // Locação e direito de passagem
    S0305 = "03.05", // Cessão de andaimes e estruturas

    // 4 – Serviços de saúde
    S0401 = "04.01", // Medicina e biomedicina
    S0402 = "04.02", // Análises clínicas e congêneres
    S0403 = "04.03", // Hospitais, clínicas e congêneres
    S0404 = "04.04", // Instrumentação cirúrgica
    S0405 = "04.05", // Acupuntura
    S0406 = "04.06", // Enfermagem
    S0407 = "04.07", // Serviços farmacêuticos
    S0408 = "04.08", // Terapia ocupacional e fisioterapia
    S0409 = "04.09", // Terapias diversas
    S0410 = "04.10", // Nutrição
    S0411 = "04.11", // Obstetrícia
    S0412 = "04.12", // Odontologia
    S0413 = "04.13", // Ortóptica
    S0414 = "04.14", // Próteses
    S0415 = "04.15", // Psicanálise
    S0416 = "04.16", // Psicologia
    S0417 = "04.17", // Casas de repouso e congêneres
    S0418 = "04.18", // Inseminação artificial
    S0419 = "04.19", // Bancos de materiais biológicos
    S0420 = "04.20", // Coleta de materiais biológicos
    S0421 = "04.21", // Unidade de atendimento móvel
    S0422 = "04.22", // Planos de medicina de grupo
    S0423 = "04.23", // Outros planos de saúde

    // 17 – Serviços técnicos e profissionais
    S1701 = "17.01", // Assessoria ou consultoria
    S1702 = "17.02", // Datilografia e secretaria
    S1703 = "17.03", // Elaboração de programas
    S1704 = "17.04", // Planejamento e organização
    S1705 = "17.05", // Recrutamento e seleção
    S1706 = "17.06", // Propaganda e publicidade
    S1707 = "17.07", // Franquia (franchising)
    S1708 = "17.08", // Perícias e laudos técnicos
    S1709 = "17.09", // Planejamento de feiras
    S1710 = "17.10", // Organização de festas
    S1711 = "17.11", // Administração em geral
    S1712 = "17.12", // Leilão
    S1713 = "17.13", // Advocacia
    S1714 = "17.14", // Arbitragem
    S1715 = "17.15", // Auditoria
    S1716 = "17.16", // Análise de Organização
    S1717 = "17.17", // Atuária e cálculos
    S1718 = "17.18", // Contabilidade
    S1719 = "17.19", // Consultoria econômica
    S1720 = "17.20", // Estatística
    S1721 = "17.21", // Cobrança
    S1722 = "17.22", // Assessoria e avaliação
    S1723 = "17.23", // Apresentações e palestras
    S1724 = "17.24", // Inserção de propaganda
}