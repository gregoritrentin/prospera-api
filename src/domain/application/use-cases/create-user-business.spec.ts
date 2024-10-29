
import { CreateUserBusinessUseCase } from "@/domain/application/use-cases/create-user-business";
import { InMemoryuserBusinessRepository } from "test/repositories/in-memory-user-business";

let inMemoryUserBusinessRepository: InMemoryuserBusinessRepository;
let sut: CreateUserBusinessUseCase;

describe("Create UserBusiness", () => {
  beforeEach(() => {
    inMemoryUserBusinessRepository = new InMemoryuserBusinessRepository();
    sut = new CreateUserBusinessUseCase(inMemoryUserBusinessRepository);
  });

  it("should be able to create a UserBusiness", async () => {
    const result = await sut.execute({
      businessId: '123e4567-e89b-12d3-a456-426614174020',
      userId: '1234.5.67-8901',
      role: 'admin',
    });

    expect(result.isRight()).toBe(true);


    expect(inMemoryUserBusinessRepository.items[0]).toEqual(result.value?.userBusiness);
  });

  it("should persist UserBusiness data correctly", async () => {
    const result = await sut.execute({
       businessId: '123e4567-e89b-12d3-a456-426614174020',
        userId: '1234.5.67-8901',
      role: 'admin',
    });

    expect(result.isRight()).toBe(true);

    const createdUserBusiness = result.value?.userBusiness    

    expect(createdUserBusiness).toBeTruthy();
    expect(createdUserBusiness?.businessId.value).toBe("123e4567-e89b-12d3-a456-426614174020");  
      expect(createdUserBusiness?.userId.value).toBe("1234.5.67-8901");
    expect(createdUserBusiness?.role).toBe("admin");
  });

});
