import { CreateUserTermUseCase } from "@/domain/application/use-cases/create-user-term";
import { InMemoryUserTermRepository } from "test/repositories/in-memory-user-term-repository";
import { TermRepository } from "@/domain/application/repositories/term-repository";

let inMemoryUserTermRepository: InMemoryUserTermRepository;
let sut: CreateUserTermUseCase;

describe("Create User Term", () => {
  beforeEach(() => {
    inMemoryUserTermRepository = new InMemoryUserTermRepository();
    sut = new CreateUserTermUseCase(inMemoryUserTermRepository);
  });

  it("should be able to create a User Term", async () => {
    const result = await sut.execute({
      userId: "User1234_ABX",
      ip: "127.0.0.1",
      latestTerm: { id: "latest-term-id" },
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryUserTermRepository.items[0]).toEqual(result.value?.userTerm);
  });

  it("should persist Term data correctly", async () => {
    const result = await sut.execute({
      userId: "User1234_ABX",
      ip: "127.0.0.1",
      latestTerm: { id: "latest-term-id" },
    });

    expect(result.isRight()).toBe(true);

    const createdUserTerm = result.value?.userTerm;

    expect(createdUserTerm).toBeTruthy();
    expect(createdUserTerm?.ip).toBe("127.0.0.1");
    expect(createdUserTerm?.userId.value).toBe("User1234_ABX");
    //quando tiver problema de equal, usar o .value
  });
});
