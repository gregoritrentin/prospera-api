import { BusinessApp } from '@/domain/application/entities/business-app';
import { BusinessAppRepository } from '@/domain/application/repositories/business-app-repository';
import { NotImplementedException } from '@nestjs/common';
import { BusinessAppDetails } from '@/domain/application/entities/value-objects/business-app-details';


export class InMemoryBusinessAppRepository implements BusinessAppRepository {

  public items: BusinessApp[] = []

  constructor() { }

  async findById(_id: string): Promise<BusinessApp | null> {

    {    throw new NotImplementedException('Method setLogo not implemented');}
  }

  async findMany(_businessId: string): Promise<BusinessAppDetails[]> {
    {    throw new NotImplementedException('Method setLogo not implemented');}
  } 
  

  async create(business: BusinessApp) {
    this.items.push(business)


}

  async save(business: BusinessApp) {
    {    throw new NotImplementedException('Method setLogo not implemented');}
  }

  async delete(business: BusinessApp) {
    {    throw new NotImplementedException('Method setLogo not implemented');}

  }


  }
 