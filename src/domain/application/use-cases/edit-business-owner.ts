import { Either, left, right } from "@/core/either";
import { AppError } from "@/core/errors/app-errors";
import { BusinessOwner } from "@/domain/application/entities/business-owner";
import { BusinessOwnerRepository } from "@/domain/application/repositories/business-owner-repository";
import { Injectable } from "@nestjs/common";

interface EditBusinessOwnerUseCaseRequest {
  businessOwnerId: string;
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3?: string | null | undefined;
  neighborhood: string;
  postalCode: string;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  status: string;
  ownerType: string;
}

type EditBusinessOwnerUseCaseResponse = Either<
  AppError,
  {
    businessOwner: BusinessOwner;
  }
>;

@Injectable()
export class EditBusinessOwnerUseCase {
  constructor(private businessOwnerRepository: BusinessOwnerRepository) {}

  async execute({
    businessOwnerId,
    name,
    phone,
    email,
    addressLine1,
    addressLine2,
    addressLine3,
    neighborhood,
    postalCode,
    countryCode,
    stateCode,
    cityCode,
    status,
    ownerType,
  }: EditBusinessOwnerUseCaseRequest): Promise<EditBusinessOwnerUseCaseResponse> {
    if (!name || name.trim() === "") {
      return left(AppError.invalidParameter("errors.INVALID_NAME"));
    }

    // 📧 Validação de e-mail com parameters
    const emailParams = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailParams.test(email)) {
      return left(AppError.invalidParameter("errors.INVALID_EMAIL"));
    }

    // // 📞 Validação inteligente de telefone
    // const phoneParams =
    //   /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-3])\d{3})-?(\d{4}))$/;

    // if (!phone || !phoneParams.test(phone)) {
    //   return left(AppError.invalidParameter("errors.INVALID_PHONE"));
    // }

    const businessOwner =
      await this.businessOwnerRepository.findById(businessOwnerId);

    if (!businessOwner) {
      return left(AppError.resourceNotFound("errors.RESOURCE_NOT_FOUND"));
    }

    businessOwner.name = name;
    businessOwner.phone = phone;
    businessOwner.email = email;
    businessOwner.document = businessOwner.document;
    businessOwner.addressLine1 = addressLine1;
    businessOwner.addressLine2 = addressLine2;
    businessOwner.addressLine3 = addressLine3;
    businessOwner.neighborhood = neighborhood;
    businessOwner.postalCode = postalCode;
    businessOwner.countryCode = countryCode;
    businessOwner.stateCode = stateCode;
    businessOwner.cityCode = cityCode;
    businessOwner.status = status;
    businessOwner.ownerType = ownerType;

    await this.businessOwnerRepository.save(businessOwner);

    return right({
      businessOwner,
    });
  }
}
