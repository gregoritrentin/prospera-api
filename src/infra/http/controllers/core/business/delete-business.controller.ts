import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { DeleteBusinessUseCase } from "@/domain/application/use-cases/delete-business";

@Controller("/business/:id")
export class DeleteBusinessController {
  constructor(private deleteBusiness: DeleteBusinessUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") businessId: string) {
    const result = await this.deleteBusiness.execute({
      businessId: businessId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
