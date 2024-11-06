// import { CreateUserUseCase } from "@/domain/application/use-cases/create-user";
// import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";

// let inMemoryUserRepository: InMemoryUserRepository;
// let sut: CreateUserUseCase;

// describe("Create User", () => {
//   beforeEach(() => {
//     inMemoryUserRepository = new InMemoryUserRepository();
//     sut = new CreateUserUseCase(inMemoryUserRepository);
//   });

//   it("should be able to create a user", async () => {
//     const result = await sut.execute({
//       name: "Grégori Trentin",
//       email: "gregori@prosperatecnologia.com.br",
//       password: "123456",
//       defaultBusiness: new Date(3, 3, 2023).toISOString(),
//       photoFileId: new Date().toISOString(),
//     });

//     expect(result.isRight()).toBe(true);
//     expect(inMemoryUserRepository.items[0]).toEqual(result.value?.user);
//   });

//   it("should persist user data correctly", async () => {
//     const result = await sut.execute({
//       name: "Grégori Trentin",
//       email: "gregori@prosperatecnologia.com.br",
//       password: "123456",
//       defaultBusiness: new Date(3, 3, 2023).toISOString(),
//       photoFileId: new Date().toISOString(),
//     });

//     const createdUser = result.value?.user;

//     expect(createdUser?.name).toBe("Grégori Trentin");
//     expect(createdUser?.email).toBe("gregori@prosperatecnologia.com.br");
//     expect(createdUser?.password).toBe("123456");
//     expect(createdUser?.status).toBe("ACTIVE");
//   });
// });
