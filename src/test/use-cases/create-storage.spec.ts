import { CreateStorageUseCase } from "@/domain/use-cases/create-storage";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryStorageRepository: InMemoryStorageRepository;

test("Create an storage for product", async () => {
  inMemoryProductsRepository = new InMemoryProductsRepository();
  inMemoryStorageRepository = new InMemoryStorageRepository();

  const useCase = new CreateStorageUseCase(
    inMemoryProductsRepository,
    inMemoryStorageRepository,
  );

  const product = Product.create({
    name: "sabonete",
    description: "Sabonete muito bom",
    minStorage: 10,
  });

  await inMemoryProductsRepository.create(product);

  const storageCreated = await useCase.execute({
    productId: product.id,
    amount: 100,
  });

  expect(storageCreated.productId).toBeInstanceOf(UniqueEntityID);
  expect(storageCreated.amount).toEqual(100);
});
