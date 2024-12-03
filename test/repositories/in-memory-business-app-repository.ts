import { BusinessApp } from "@/domain/application/entities/business-app";
import { BusinessAppRepository } from "@/domain/application/repositories/business-app-repository";
import { BusinessAppDetails } from "@/domain/application/entities/value-objects/business-app-details";

export class InMemoryBusinessAppRepository implements BusinessAppRepository {
  public items: BusinessApp[] = [];

  async findById(id: string): Promise<BusinessApp | null> {
    return this.items.find((item) => item?.appId?.toString() === id) ?? null;
  }

  async findMany(businessId: string): Promise<BusinessAppDetails[]> {
    return this.items
      .filter((item) => item.businessId.toString() === businessId)
      .map((app) => BusinessAppDetails.create(app));
  }

  async create(businessApp: BusinessApp) {
    this.items.push(businessApp);
  }

  async save(businessApp: BusinessApp) {
    const index = this.items.findIndex(
      (item) => item.appId.toString() === businessApp.appId.toString()
    );
    if (index >= 0) {
      this.items[index] = businessApp;
    }
  }

  async delete(businessApp: BusinessApp): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.appId.toString() === businessApp.appId.toString()
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
