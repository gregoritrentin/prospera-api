import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Receivable } from '../entities/receivable';
import { ReceivableRepository } from '../repositories/receivable-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppError } from '@/core/errors/app-errors';
import { ReceivableStatus } from '@/core/types/enums';


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