import { Item } from '@/domain/item/entities/item'
import { ItemRepository } from '@/domain/item/repositories/item-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
//import { Injectable } from '@nestjs/common'

interface CreateItemUseCaseRequest {
    businessId: string;
    description: string;
    idAux: string;
    itemType: string;
    unit: string;
    price: number;
    ncm: string | null;
    taxationId: string | null;
    groupId: string | null;
    status: string;
}

interface CreateItemUseCaseResponse {
    item: Item;
}

export class CreateItemUseCase {
    constructor(private itemsRepository: ItemRepository) { }

    async execute({
        businessId,
        description,
        idAux,
        itemType,
        unit,
        price,
        ncm,
        taxationId,
        groupId,
        status,
    }: CreateItemUseCaseRequest): Promise<Either<Error, CreateItemUseCaseResponse>> {
        const item = Item.create({
            businessId: new UniqueEntityID(businessId),
            description,
            idAux,
            itemType,
            unit,
            price,
            ncm,
            taxationId: taxationId ? new UniqueEntityID(taxationId) : null,
            groupId: groupId ? new UniqueEntityID(groupId) : null,
            status,
        });

        await this.itemsRepository.create(item);

        return right({
            item,
        });
    }
}