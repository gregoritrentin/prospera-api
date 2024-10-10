export class SaleValidationError extends Error {
    constructor(
        public readonly errorCode: string,
        public readonly translationKey: string,
        public readonly details?: Record<string, any>
    ) {
        super(translationKey);
        this.name = 'SaleValidationError';

        Object.setPrototypeOf(this, SaleValidationError.prototype);
    }

    static itemCountError(): SaleValidationError {
        return new SaleValidationError('SALE_NO_ITEMS', 'errors.SALE_NO_ITEMS');
    }

    static productAmountMismatch(expected: number, actual: number): SaleValidationError {
        return new SaleValidationError('PRODUCT_AMOUNT_MISMATCH', 'errors.PRODUCT_AMOUNT_MISMATCH', { expected, actual });
    }

    static grossAmountMismatch(expected: number, actual: number): SaleValidationError {
        return new SaleValidationError('GROSS_AMOUNT_MISMATCH', 'errors.GROSS_AMOUNT_MISMATCH', { expected, actual });
    }

    static totalAmountMismatch(expected: number, actual: number): SaleValidationError {
        return new SaleValidationError('TOTAL_AMOUNT_MISMATCH', 'errors.TOTAL_AMOUNT_MISMATCH', { expected, actual });
    }

    static commissionAmountMismatch(expected: number, actual: number): SaleValidationError {
        return new SaleValidationError('COMMISSION_AMOUNT_MISMATCH', 'errors.COMMISSION_AMOUNT_MISMATCH', { expected, actual });
    }

    static resourceNotFound(): SaleValidationError {
        return new SaleValidationError('RESOURCE_NOT_FOUND', 'errors.RESOURCE_NOT_FOUND');
    }

    static notAllowed(): SaleValidationError {
        return new SaleValidationError('NOT_ALLOWED', 'errors.NOT_ALLOWED');
    }

    static invalidData(details?: Record<string, any>): SaleValidationError {
        return new SaleValidationError('INVALID_DATA', 'errors.INVALID_DATA', details);
    }
}