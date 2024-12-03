import { PaginationParams } from "@/core/repositories/pagination-params";
import { ItemGroupRepository } from "@/domain/item/repositories/item-group-repository";
import { ItemGroup } from "@/domain/item/entities/item-group";

export class InMemoryItemGroupRepository implements ItemGroupRepository {
  public itemGroups: ItemGroup[] = [];

  async findById(id: string, businessId: string): Promise<ItemGroup | null> {
    const itemGroup = this.itemGroups.find(
      (group) =>
        group.id.toString() === id && group.businessId.toString() === businessId
    );

    return itemGroup || null;
  }

  async findMany(
    { page }: PaginationParams,
    businessId: string
  ): Promise<ItemGroup[]> {
    const itemGroups = this.itemGroups
      .filter((group) => group.businessId.toString() === businessId)
      .slice((page - 1) * 20, page * 20);

    return itemGroups;
  }

  async create(itemGroup: ItemGroup): Promise<void> {
    this.itemGroups.push(itemGroup);
  }

  async save(itemGroup: ItemGroup): Promise<void> {
    const itemGroupIndex = this.itemGroups.findIndex(
      (existingGroup) => existingGroup.id.toString() === itemGroup.id.toString()
    );

    if (itemGroupIndex !== -1) {
      this.itemGroups[itemGroupIndex] = itemGroup;
    }
  }

  async delete(itemGroup: ItemGroup): Promise<void> {
    const itemGroupIndex = this.itemGroups.findIndex(
      (existingGroup) => existingGroup.id.toString() === itemGroup.id.toString()
    );

    if (itemGroupIndex !== -1) {
      this.itemGroups.splice(itemGroupIndex, 1);
    }
  }
}
