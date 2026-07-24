import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CadSuplierUseCase } from "../../domain/use-cases/cad-suplier";
import { InMemorySupiersRepository } from "../in-memory/in-memory-suplier-repository";

let inMemorySupiersRepository: InMemorySupiersRepository;
let useCase: CadSuplierUseCase;

describe("Cad Suplier Use Case", () => {
  beforeEach(() => {
    inMemorySupiersRepository = new InMemorySupiersRepository();
    useCase = new CadSuplierUseCase(inMemorySupiersRepository);
  });

  test("Create a suplier", async () => {
    const suplier = await useCase.execute({
      name: "Omo Suplementos",
      address: "Rua 6, barro: São José",
      cnpj: "125.564.0001/01",
    });

    expect(suplier.id).toBeInstanceOf(UniqueEntityID);
    expect(suplier.name).toEqual("Omo Suplementos");
  });
});
