import { PaginationParams } from "@/core/repositories/pagination-params";
import { ItemTaxationRepository } from "@/domain/item/repositories/Item-taxation-repository";
import { ItemTaxation } from "@/domain/item/entities/Item-taxation";

export class InMemoryItemTaxationRepository implements ItemTaxationRepository {
  public itemTaxation: ItemTaxation[] = [];

  // Deveria ser assim:
  async findById(id: string) {
    const itemTaxation = this.itemTaxation.find(
      (item) => item.id.toString() === id // Remover a verificação do businessId aqui
    );
    return itemTaxation || null;
  }

  async findMany(
    { page }: PaginationParams,
    businessId: string
  ): Promise<ItemTaxation[]> {
    const itemTaxation = this.itemTaxation
      .filter((group) => group.businessId.toString() === businessId)
      .slice((page - 1) * 20, page * 20);

    return itemTaxation;
  }

  async create(itemGroup: ItemTaxation): Promise<void> {
    this.itemTaxation.push(itemGroup);
  }

  async save(itemGroup: ItemTaxation): Promise<void> {
    const itemGroupIndex = this.itemTaxation.findIndex(
      (existingGroup) => existingGroup.id.toString() === itemGroup.id.toString()
    );

    if (itemGroupIndex !== -1) {
      this.itemTaxation[itemGroupIndex] = itemGroup;
    }
  }

  async delete(itemGroup: ItemTaxation): Promise<void> {
    const itemGroupIndex = this.itemTaxation.findIndex(
      (existingGroup) => existingGroup.id.toString() === itemGroup.id.toString()
    );

    if (itemGroupIndex !== -1) {
      this.itemTaxation.splice(itemGroupIndex, 1);
    }
  }
}
