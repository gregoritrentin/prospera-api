import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { Receivable } from '@core/entiti@core/receivable';
import { ReceivableRepository } from '@core/repositori@core/receivable-repository';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { AppError } from @core/co@core/erro@core/app-errors';
import { ReceivableStatus } from @core/co@core/typ@core/enums';


interface EditReceivableUseCaseRequest {
    receivableId: string;
    businessId: string;
    currentOwnerId?: string;
    netAmount?: number;
    currentDueDate?: Date;
    status: ReceivableStatus;
}

type EditReceivableUseCaseResponse = Either<
    AppError,
    {
        receivable: Receivable;
    }
>;

@Injectable()
export class EditReceivableUseCase {
    constructor(private receivableRepository: ReceivableRepository) { }

    async execute({
        receivableId,
        businessId,
        currentOwnerId,
        netAmount,
        currentDueDate,
        status,
    }: EditReceivableUseCaseRequest): Promise<EditReceivableUseCaseResponse> {
        try {
            const receivable = await this.receivableRepository.findById(receivableId, businessId);

            if (!receivable) {
                return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
            }

            if (netAmount !== undefined) {
                if (netAmount <= 0 || netAmount > receivable.amount) {
                    return left(AppError.invalidAmount(netAmount));
                }
                receivable.netAmount = netAmount;
            }

            if (currentOwnerId !== undefined) {
                receivable.currentOwnerId = new UniqueEntityID(currentOwnerId);
            }

            if (currentDueDate !== undefined) {
                receivable.currentDueDate = currentDueDate;
            }

            if (status !== undefined) {
              @core// Validar transições de status permitidas
                if (!this.isValidStatusTransition(receivable.status, status)) {
                    return left(AppError.invalidOperation('Invalid status transition'));
                }
                receivable.status = status;
            }

            await this.receivableRepository.save(receivable);

            return right({
                receivable,
            });
        } catch (error) {
            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'));
        }
    }

    private isValidStatusTransition(currentStatus: ReceivableStatus, newStatus: ReceivableStatus): boolean {
        const validTransitions: Record<ReceivableStatus, ReceivableStatus[]> = {
            [ReceivableStatus.PENDING]: [ReceivableStatus.AVAILABLE, ReceivableStatus.CANCELLED],
            [ReceivableStatus.AVAILABLE]: [ReceivableStatus.ANTICIPATED, ReceivableStatus.PAID],
            [ReceivableStatus.ANTICIPATED]: [ReceivableStatus.PAID],
            [ReceivableStatus.PAID]: [],
            [ReceivableStatus.CANCELLED]: [],
        };

        return validTransitions[currentStatus].includes(newStatus);
    }
}