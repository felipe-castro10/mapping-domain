import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CadProductUseCase } from "../../domain/use-cases/cad-product";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";

let inMemoryProductsRepository: InMemoryProductsRepository;

test("create an product", async () => {
  inMemoryProductsRepository = new InMemoryProductsRepository();
  const useCase = new CadProductUseCase(inMemoryProductsRepository);

  const product = await useCase.execute({
    name: "Sabonete",
    description: "Sabonete muito bom",
    minStorage: 10,
  });

  expect(product.id).toBeInstanceOf(UniqueEntityID);
  expect(product.minStorage).toEqual(10);
  expect(product.name).toEqual("Sabonete");
});
