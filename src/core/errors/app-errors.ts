import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
    // Core/Common Errors
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    NOT_ALLOWED = 'NOT_ALLOWED',
    CONFLICT = 'CONFLICT',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    NO_ITEMS = 'NO_ITEMS',

    // Validation & Data Errors
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INVALID_OPERATION = 'INVALID_OPERATION',
    INVALID_TOKEN = 'INVALID_TOKEN',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    INVALID_DATA = 'INVALID_DATA',
    INVALID_DATE = 'INVALID_DATE',
    INVALID_LIMIT_DATE = 'INVALID_LIMIT_DATE',
    INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',

    // Database & Resource Errors
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    UNIQUE_CONSTRAINT_VIOLATION = 'UNIQUE_CONSTRAINT_VIOLATION',
    DATABASE_ERROR = 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

    // File Operations
    FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // Payment & Financial Module
    INVALID_AMOUNT = 'INVALID_AMOUNT',
    INVALID_DUE_DATE = 'INVALID_DUE_DATE',
    INVALID_PIX_KEY = 'INVALID_PIX_KEY',

    // Boleto Submodule
    BOLETO_CREATION_FAILED = 'BOLETO_CREATION_FAILED',
    BOLETO_CANCELATION_FAILED = 'BOLETO_CANCELATION_FAILED',
    BOLETO_PRINT_FAILED = 'BOLETO_PRINT_FAILED',

    // PIX Submodule
    PIX_CREATION_FAILED = 'PIX_CREATION_FAILED',
    PAYMENT_PIX_CREATION_FAILED = 'PAYMENT_PIX_CREATION_FAILED',
    PAYMENT_PIX_UPDATE_FAILED = 'PAYMENT_PIX_UPDATE_FAILED',
    PAYMENT_PIX_PROOF_FETCH_FAILED = 'PAYMENT_PIX_PROOF_FETCH_FAILED',
    PAYMENT_PIX_CANCELATION_FAILED = 'PAYMENT_PIX_CANCELATION_FAILED',

    // Sales Module
    PRODUCT_AMOUNT_MISMATCH = 'PRODUCT_AMOUNT_MISMATCH',
    GROSS_AMOUNT_MISMATCH = 'GROSS_AMOUNT_MISMATCH',
    TOTAL_AMOUNT_MISMATCH = 'TOTAL_AMOUNT_MISMATCH',
    COMMISSION_AMOUNT_MISMATCH = 'COMMISSION_AMOUNT_MISMATCH',

    // Invoice Module
    INVOICE_CANCELATION_FAILED = 'INVOICE_CANCELATION_FAILED',

    // Subscription Module
    SUBSCRIPTION_CANCELATION_FAILED = 'SUBSCRIPTION_CANCELATION_FAILED', // Fixed the value

    // NFSe Module
    NFSE_CREATION_FAILED = 'NFSE_CREATION_FAILED',
    NFSE_TRANSMISSION_FAILED = 'NFSE_TRANSMISSION_FAILED',
    NFSE_CANCELLATION_FAILED = 'NFSE_CANCELLATION_FAILED',
    NFSE_QUERY_FAILED = 'NFSE_QUERY_FAILED',
    NFSE_REPLACEMENT_FAILED = 'NFSE_REPLACEMENT_FAILED',
    NFSE_SIGNATURE_FAILED = 'NFSE_SIGNATURE_FAILED',
    NFSE_XML_GENERATION_FAILED = 'NFSE_XML_GENERATION_FAILED',
    NFSE_CERTIFICATE_ERROR = 'NFSE_CERTIFICATE_ERROR',
    NFSE_PROVIDER_NOT_FOUND = 'NFSE_PROVIDER_NOT_FOUND',
    NFSE_INVALID_XML = 'NFSE_INVALID_XML',
    NFSE_INVALID_RESPONSE = 'NFSE_INVALID_RESPONSE',

    // Certificate Module
    CERTIFICATE_NOT_FOUND = 'CERTIFICATE_NOT_FOUND',
    CERTIFICATE_INACTIVE = 'CERTIFICATE_INACTIVE',
    CERTIFICATE_EXPIRED = 'CERTIFICATE_EXPIRED',
    CERTIFICATE_FILE_NOT_FOUND = 'CERTIFICATE_FILE_NOT_FOUND',
    CERTIFICATE_LOAD_ERROR = 'CERTIFICATE_LOAD_ERROR',
    CERTIFICATE_VALIDATION_ERROR = 'CERTIFICATE_VALIDATION_ERROR',
    CERTIFICATE_UPLOAD_FAILED = 'CERTIFICATE_UPLOAD_FAILED',
    CERTIFICATE_CREATION_FAILED = 'CERTIFICATE_CREATION_FAILED',
    CERTIFICATE_ALREADY_EXISTS = 'CERTIFICATE_ALREADY_EXISTS',
    CERTIFICATE_PASSWORD_INVALID = 'CERTIFICATE_PASSWORD_INVALID',
    CERTIFICATE_FORMAT_INVALID = 'CERTIFICATE_FORMAT_INVALID',
    ACTIVE_CERTIFICATE_EXISTS = 'ACTIVE_CERTIFICATE_EXISTS',
    CERTIFICATE_VALIDATION_FAILED = 'CERTIFICATE_VALIDATION_FAILED',

    // Signature Module
    SIGNATURE_ERROR = 'SIGNATURE_ERROR',
    SIGNATURE_CREATION_ERROR = 'SIGNATURE_CREATION_ERROR',
    SIGNATURE_VALIDATION_ERROR = 'SIGNATURE_VALIDATION_ERROR',
    SIGNATURE_INSERTION_ERROR = 'SIGNATURE_INSERTION_ERROR',
    SIGNATURE_POINT_NOT_FOUND = 'SIGNATURE_POINT_NOT_FOUND',

    // Two Factor Authentication Module
    TWO_FACTOR_USER_NO_PHONE = 'TWO_FACTOR_USER_NO_PHONE',
    TWO_FACTOR_ALREADY_ACTIVE = 'TWO_FACTOR_ALREADY_ACTIVE',
    TWO_FACTOR_SEND_FAILED = 'TWO_FACTOR_SEND_FAILED',
    TWO_FACTOR_EXPIRED = 'TWO_FACTOR_EXPIRED',
    TWO_FACTOR_INVALID_CODE = 'TWO_FACTOR_INVALID_CODE',
    TWO_FACTOR_MAX_ATTEMPTS = 'TWO_FACTOR_MAX_ATTEMPTS',
    TWO_FACTOR_NOT_FOUND = 'TWO_FACTOR_NOT_FOUND',
    TWO_FACTOR_ALREADY_VERIFIED = 'TWO_FACTOR_ALREADY_VERIFIED',
    TWO_FACTOR_VERIFICATION_FAILED = 'TWO_FACTOR_VERIFICATION_FAILED'
}

export class AppError extends Error {
    constructor(
        public readonly errorCode: ErrorCode,
        public readonly translationKey: string,
        public readonly details?: Record<string, any>,
        public readonly httpStatus: HttpStatus = HttpStatus.BAD_REQUEST
    ) {
        super(translationKey);
        this.name = 'AppError';
    }

    static uniqueConstraintViolation(entity: string, field: string, value: string): AppError {
        return new AppError(
            ErrorCode.UNIQUE_CONSTRAINT_VIOLATION,
            'errors.UNIQUE_CONSTRAINT_VIOLATION',
            { entity, field, value },
            HttpStatus.CONFLICT
        );
    }

    static badRequest(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.BAD_REQUEST,
            translationKey,
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static unauthorized(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.UNAUTHORIZED,
            translationKey,
            details,
            HttpStatus.UNAUTHORIZED
        );
    }

    static forbidden(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.FORBIDDEN,
            translationKey,
            details,
            HttpStatus.FORBIDDEN
        );
    }

    static resourceNotFound(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NOT_FOUND,
            translationKey,
            details,
            HttpStatus.NOT_FOUND
        );
    }

    static notAllowed(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NOT_ALLOWED,
            translationKey,
            details,
            HttpStatus.FORBIDDEN
        );
    }

    static conflict(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CONFLICT,
            translationKey,
            details,
            HttpStatus.CONFLICT
        );
    }

    static internalServerError(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.INTERNAL_SERVER_ERROR,
            translationKey,
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static invalidCredentials(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.INVALID_CREDENTIALS,
            'errors.INVALID_CREDENTIALS',
            details,
            HttpStatus.UNAUTHORIZED
        );
    }

    static invalidOperation(message: string): AppError {
        return new AppError(
            ErrorCode.INVALID_OPERATION,
            'errors.INVALID_OPERATION',
            { message },
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidData(message: string): AppError {
        return new AppError(
            ErrorCode.INVALID_DATA,
            'errors.INVALID_DATA',
            { message },
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidLimitData(message: string): AppError {
        return new AppError(
            ErrorCode.INVALID_LIMIT_DATE,
            'errors.INVALID_LIMIT_DATA',
            { message },
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidFileType(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.INVALID_FILE_TYPE,
            'errors.INVALID_FILE_TYPE',
            details,
            HttpStatus.UNAUTHORIZED
        );
    }

    static invalidAmount(amount: number): AppError {
        return new AppError(
            ErrorCode.INVALID_AMOUNT,
            'errors.INVALID_AMOUNT',
            { amount },
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidDueDate(): AppError {
        return new AppError(
            ErrorCode.INVALID_DUE_DATE,
            'errors.INVALID_DUE_DATE',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidDate(): AppError {
        return new AppError(
            ErrorCode.INVALID_DATE,
            'errors.INVALID_DATE',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static invalidPixKey(): AppError {
        return new AppError(
            ErrorCode.INVALID_PIX_KEY,
            'errors.INVALID_PIX_KEY',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static boletoCreationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.BOLETO_CREATION_FAILED,
            'errors.BOLETO_CREATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static boletoCancelationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.BOLETO_CANCELATION_FAILED,
            'errors.BOLETO_CANCELATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static boletoPrintFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.BOLETO_PRINT_FAILED,
            'errors.BOLETO_PRINT_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static pixCreationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.PIX_CREATION_FAILED,
            'errors.PIX_CREATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static paymentPixCreationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.PAYMENT_PIX_CREATION_FAILED,
            'errors.PAYMENT_PIX_CREATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static paymentPixUpdateFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.PAYMENT_PIX_UPDATE_FAILED,
            'errors.PAYMENT_PIX_UPDATE_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static paymentPixProofFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.PAYMENT_PIX_PROOF_FETCH_FAILED,
            'errors.PAYMENT_PIX_PROOF_FETCH_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static paymentPixCancelationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.PAYMENT_PIX_CANCELATION_FAILED,
            'errors.PAYMENT_PIX_CANCELATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }


    static invoiceCancelationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.INVOICE_CANCELATION_FAILED,
            'errors.INVOICE_CANCELATION_FAILED',
            details,
            HttpStatus.FORBIDDEN
        );
    }

    static subscriptionCancelationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.SUBSCRIPTION_CANCELATION_FAILED,
            'errors.SUBSCRIPTION_CANCELATION_FAILED',
            details,
            HttpStatus.FORBIDDEN
        );
    }

    static noItems(p0: string): AppError {
        return new AppError(
            ErrorCode.NO_ITEMS,
            'errors.NO_ITEMS',
            {},
            HttpStatus.BAD_REQUEST
        );
    }


    static invalidStatusTransition(message: string): AppError {
        return new AppError(
            ErrorCode.INVALID_STATUS_TRANSITION,
            'errors.INVALID_STATUS_TRANSITION',
            { message },
            HttpStatus.BAD_REQUEST
        );
    }

    static rateLimitExceeded(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.RATE_LIMIT_EXCEEDED,
            translationKey,
            details,
            HttpStatus.TOO_MANY_REQUESTS
        );
    }

    static nfseCreationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_CREATION_FAILED,
            'errors.NFSE_CREATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseTransmissionFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_TRANSMISSION_FAILED,
            'errors.NFSE_TRANSMISSION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseCancellationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_CANCELLATION_FAILED,
            'errors.NFSE_CANCELLATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseQueryFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_QUERY_FAILED,
            'errors.NFSE_QUERY_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseReplacementFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_REPLACEMENT_FAILED,
            'errors.NFSE_REPLACEMENT_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseSignatureFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_SIGNATURE_FAILED,
            'errors.NFSE_SIGNATURE_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseXmlGenerationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_XML_GENERATION_FAILED,
            'errors.NFSE_XML_GENERATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseCertificateError(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_CERTIFICATE_ERROR,
            'errors.NFSE_CERTIFICATE_ERROR',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static nfseProviderNotFound(cityCode: string): AppError {
        return new AppError(
            ErrorCode.NFSE_PROVIDER_NOT_FOUND,
            'errors.NFSE_PROVIDER_NOT_FOUND',
            { cityCode },
            HttpStatus.NOT_FOUND
        );
    }

    static nfseInvalidXml(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_INVALID_XML,
            'errors.NFSE_INVALID_XML',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static nfseInvalidResponse(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.NFSE_INVALID_RESPONSE,
            'errors.NFSE_INVALID_RESPONSE',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static validationError(translationKey: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.VALIDATION_ERROR,
            translationKey,
            details,
            HttpStatus.BAD_REQUEST
        );
    }
    static certificateNotFound(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_NOT_FOUND,
            'errors.CERTIFICATE_NOT_FOUND',
            details,
            HttpStatus.NOT_FOUND
        );
    }

    static certificateInactive(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_INACTIVE,
            'errors.CERTIFICATE_INACTIVE',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static certificateExpired(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_EXPIRED,
            'errors.CERTIFICATE_EXPIRED',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static certificateFileNotFound(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_FILE_NOT_FOUND,
            'errors.CERTIFICATE_FILE_NOT_FOUND',
            details,
            HttpStatus.NOT_FOUND
        );
    }

    static certificateLoadError(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_LOAD_ERROR,
            'errors.CERTIFICATE_LOAD_ERROR',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static signatureError(message: string, details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.SIGNATURE_ERROR,
            'errors.SIGNATURE_ERROR',
            { message, ...details },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static signatureValidationError(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.SIGNATURE_VALIDATION_ERROR,
            'errors.SIGNATURE_VALIDATION_ERROR',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static signatureInsertionError(message: string): AppError {
        return new AppError(
            ErrorCode.SIGNATURE_INSERTION_ERROR,
            'errors.SIGNATURE_INSERTION_ERROR',
            { message },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }


    static certificateUploadFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_UPLOAD_FAILED,
            'errors.CERTIFICATE_UPLOAD_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static certificateCreationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_CREATION_FAILED,
            'errors.CERTIFICATE_CREATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    static certificateAlreadyExists(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_ALREADY_EXISTS,
            'errors.CERTIFICATE_ALREADY_EXISTS',
            details,
            HttpStatus.CONFLICT
        );
    }

    static certificatePasswordInvalid(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_PASSWORD_INVALID,
            'errors.CERTIFICATE_PASSWORD_INVALID',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static certificateFormatInvalid(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_FORMAT_INVALID,
            'errors.CERTIFICATE_FORMAT_INVALID',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static activeCertificateExists(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.ACTIVE_CERTIFICATE_EXISTS,
            'errors.ACTIVE_CERTIFICATE_EXISTS',
            details,
            HttpStatus.CONFLICT
        );
    }

    static certificateValidationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.CERTIFICATE_VALIDATION_FAILED,
            'errors.CERTIFICATE_VALIDATION_FAILED',
            details,
            HttpStatus.BAD_REQUEST
        );
    }

    static fileUploadFailed(cause: any): AppError {
        return new AppError(
            ErrorCode.FILE_UPLOAD_FAILED,
            'errors.FILE_UPLOAD_FAILED',
            { cause },
            HttpStatus.INTERNAL_SERVER_ERROR
        );

    }
    static twoFactorUserNoPhone(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_USER_NO_PHONE,
            'errors.TWO_FACTOR_USER_NO_PHONE',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static twoFactorAlreadyActive(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_ALREADY_ACTIVE,
            'errors.TWO_FACTOR_ALREADY_ACTIVE',
            {},
            HttpStatus.CONFLICT
        );
    }

    static twoFactorSendFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_SEND_FAILED,
            'errors.TWO_FACTOR_SEND_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }


    static twoFactorNotFound(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_NOT_FOUND,
            'errors.TWO_FACTOR_NOT_FOUND',
            {},
            HttpStatus.NOT_FOUND
        );
    }

    static twoFactorExpired(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_EXPIRED,
            'errors.TWO_FACTOR_EXPIRED',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static twoFactorInvalidCode(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_INVALID_CODE,
            'errors.TWO_FACTOR_INVALID_CODE',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static twoFactorMaxAttempts(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_MAX_ATTEMPTS,
            'errors.TWO_FACTOR_MAX_ATTEMPTS',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static twoFactorAlreadyVerified(): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_ALREADY_VERIFIED,
            'errors.TWO_FACTOR_ALREADY_VERIFIED',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

    static twoFactorVerificationFailed(details?: Record<string, any>): AppError {
        return new AppError(
            ErrorCode.TWO_FACTOR_VERIFICATION_FAILED,
            'errors.TWO_FACTOR_VERIFICATION_FAILED',
            details,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}