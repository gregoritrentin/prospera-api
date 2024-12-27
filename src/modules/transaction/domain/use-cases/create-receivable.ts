import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { Receivable } from '@core/entiti@core/receivable';
import { ReceivableRepository } from '@core/repositori@core/receivable-repository';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { AppError } from @core/co@core/erro@core/app-errors';
import { ReceivableStatus } from @core/co@core/typ@core/enums';


interface CreateReceivableUseCaseRequest {
    transactionId: string;
    originalOwnerId: string;
    currentOwnerId: string;
    amount: number;
    netAmount: number;
    originalDueDate: Date;
    currentDueDate: Date;
    businessId: string;
}

type CreateReceivableUseCaseResponse = Either<
    AppError,
    {
        receivable: Receivable;
    }
>;

@Injectable()
export class CreateReceivableUseCase {
    constructor(private receivableRepository: ReceivableRepository) { }

    async execute({
        transactionId,
        originalOwnerId,
        currentOwnerId,
        amount,
        netAmount,
        originalDueDate,
        currentDueDate,
        businessId,
    }: CreateReceivableUseCaseRequest): Promise<CreateReceivableUseCaseResponse> {
        try {
            if (amount <= 0) {
                return left(AppError.invalidAmount(amount));
            }

            if (netAmount <= 0 || netAmount > amount) {
                return left(AppError.invalidAmount(netAmount));
            }

            const receivable = Receivable.create({
                transactionId: new UniqueEntityID(transactionId),
                originalOwnerId: new UniqueEntityID(originalOwnerId),
                currentOwnerId: new UniqueEntityID(currentOwnerId),
                amount,
                netAmount,
                originalDueDate,
                currentDueDate,
                status: ReceivableStatus.PENDING,
                businessId: new UniqueEntityID(businessId),
            });

            await this.receivableRepository.create(receivable);

            return right({
                receivable,
            });
        } catch (error) {
            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'));
        }
    }
}