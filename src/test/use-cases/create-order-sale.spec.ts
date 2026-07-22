import { CreateOrderSaleUseCase } from "@/domain/use-cases/create-order-sale";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySalesRepository } from "../in-memory/in-memory-sales-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";

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
});
