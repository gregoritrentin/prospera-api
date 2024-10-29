import { CreateTermUseCase } from "@/domain/application/use-cases/create-Term";
import { InMemorytermRepository } from "test/repositories/in-memory-term";

let inMemoryTermRepository: InMemorytermRepository;
let sut: CreateTermUseCase;

describe("Create Term", () => {
  beforeEach(() => {
    inMemoryTermRepository = new InMemorytermRepository();
    sut = new CreateTermUseCase(inMemoryTermRepository);
  });

  it("should be able to create a Term", async () => {
    const result = await sut.execute({
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryTermRepository.items[0]).toEqual(result.value?.term);
  });

  it("should persist Term data correctly", async () => {
    const result = await sut.execute({
      title: "Term title",
      content: "Term content",
      language: "PORTUGUESE",
      startAt: new Date(30, 1, 1),

    });

    expect(result.isRight()).toBe(true);

    const createdTerm = result.value?.term;

    expect(createdTerm).toBeTruthy();
    expect(createdTerm?.title).toBe("Term title");
    expect(createdTerm?.content).toBe("Term content");
    expect(createdTerm?.language).toBe("PORTUGUESE");
    expect(createdTerm?.startAt).toEqual(new Date(30, 1, 1));
  });
});
