import { CreateOrderSaleUseCase } from "@/domain/use-cases/create-order-sale";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySalesRepository } from "../in-memory/in-memory-sales-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { Storage } from "@/domain/entities/storage";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inmemoryStorageRepository: InMemoryStorageRepository;
let inMemorySalesRepository: InMemorySalesRepository;
let useCase: CreateOrderSaleUseCase;

test("create an order sale", async () => {
  inMemoryProductsRepository = new InMemoryProductsRepository();
  inmemoryStorageRepository = new InMemoryStorageRepository();
  inMemorySalesRepository = new InMemorySalesRepository();

  useCase = new CreateOrderSaleUseCase(
    inMemoryProductsRepository,
    inmemoryStorageRepository,
    inMemorySalesRepository,
  );

  const product = Product.create({
    name: "Sabonete",
    description: "Sabonete muito bom",
    minStorage: 10,
  });

  await inMemoryProductsRepository.create(product);

  const storage = Storage.create({
    productId: product.id,
    amount: 100,
  });

  await inmemoryStorageRepository.create(storage);

  const orderSale = await useCase.execute({
    productId: product.id,
    amount: 50,
  });

  console.log(orderSale);
  expect(orderSale.id).toBeInstanceOf(UniqueEntityID);
  expect(orderSale.amount).toEqual(50);
});
