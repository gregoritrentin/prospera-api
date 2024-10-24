import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    NOT_ALLOWED = 'NOT_ALLOWED',
    CONFLICT = 'CONFLICT',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

    // Códigos de erro específicos da aplicação
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INVALID_OPERATION = 'INVALID_OPERATION',
    INVALID_TOKEN = 'INVALID_TOKEN',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    INVALID_DATA = 'INVALID_DATA',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    UNIQUE_CONSTRAINT_VIOLATION = 'UNIQUE_CONSTRAINT_VIOLATION',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

    // Códigos específicos para transações/boletos
    INVALID_AMOUNT = 'INVALID_AMOUNT',
    INVALID_DUE_DATE = 'INVALID_DUE_DATE',
    INVALID_DATE = 'INVALID_DATE',

    BOLETO_CREATION_FAILED = 'BOLETO_CREATION_FAILED',
    BOLETO_CANCELATION_FAILED = 'BOLETO_CANCELAION_FAILED',
    BOLETO_PRINT_FAILED = 'BOLETO_PRINT_FAILED',

    PIX_CREATION_FAILED = 'PIX_CREATION_FAILED',


    PAYMENT_PIX_CREATION_FAILED = 'PAYMENT_PIX_CREATION_FAILED',
    PAYMENT_PIX_UPDATE_FAILED = 'PAYMENT_PIX_UPDATE_FAILED',
    PAYMENT_PIX_PROOF_FETCH_FAILED = 'PAYMENT_PIX_PROOF_FETCH_FAILED',
    PAYMENT_PIX_CANCELATION_FAILED = 'PAYMENT_PIX_CANCELATION_FAILED',

    //INVOICE
    INVOICE_CANCELATION_FAILED = 'INVOICE_CANCELATION_FAILED',


    INVALID_PIX_KEY = 'INVALID_PIX_KEY',

    //SALE
    SALE_NO_ITEMS = 'SALE_NO_ITEMS',
    PRODUCT_AMOUNT_MISMATCH = 'PRODUCT_AMOUNT_MISMATCH',
    GROSS_AMOUNT_MISMATCH = 'GROSS_AMOUNT_MISMATCH',
    TOTAL_AMOUNT_MISMATCH = 'TOTAL_AMOUNT_MISMATCH',
    COMMISSION_AMOUNT_MISMATCH = 'COMMISSION_AMOUNT_MISMATCH',
}

// static productAmountMismatch(expected: number, actual: number): SaleValidationError {
//     return new SaleValidationError('PRODUCT_AMOUNT_MISMATCH', 'errors.PRODUCT_AMOUNT_MISMATCH', { expected, actual });
// }

// static grossAmountMismatch(expected: number, actual: number): SaleValidationError {
//     return new SaleValidationError('GROSS_AMOUNT_MISMATCH', 'errors.GROSS_AMOUNT_MISMATCH', { expected, actual });
// }

// static totalAmountMismatch(expected: number, actual: number): SaleValidationError {
//     return new SaleValidationError('TOTAL_AMOUNT_MISMATCH', 'errors.TOTAL_AMOUNT_MISMATCH', { expected, actual });
// }

// static commissionAmountMismatch(expected: number, actual: number): SaleValidationError {
//     return new SaleValidationError('COMMISSION_AMOUNT_MISMATCH', 'errors.COMMISSION_AMOUNT_MISMATCH', { expected, actual });
// }




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

    static saleNoItems(): AppError {
        return new AppError(
            ErrorCode.SALE_NO_ITEMS,
            'errors.SALE_NO_ITEMS',
            {},
            HttpStatus.BAD_REQUEST
        );
    }

}