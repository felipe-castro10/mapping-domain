import { CreateOrderSaleUseCase } from "@/domain/use-cases/create-order-sale";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySalesRepository } from "../in-memory/in-memory-sales-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { Storage } from "@/domain/entities/storage";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryStorageRepository: InMemoryStorageRepository;
let inMemorySalesRepository: InMemorySalesRepository;
let useCase: CreateOrderSaleUseCase;

describe("Create Order Sale Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStorageRepository = new InMemoryStorageRepository();
    inMemorySalesRepository = new InMemorySalesRepository();

    useCase = new CreateOrderSaleUseCase(
      inMemoryProductsRepository,
      inMemoryStorageRepository,
      inMemorySalesRepository,
    );
  });

  test("should be able to create an order sale with multiple items", async () => {
    const product1 = Product.create({
      name: "Sabonete",
      description: "Sabonete muito bom",
      minStorage: 10,
    });

    const product2 = Product.create({
      name: "Shampoo",
      description: "Shampoo cheiroso",
      minStorage: 5,
    });

    await inMemoryProductsRepository.create(product1);
    await inMemoryProductsRepository.create(product2);

    const storage1 = Storage.create({
      productId: product1.id,
      amount: 100,
    });

    const storage2 = Storage.create({
      productId: product2.id,
      amount: 50,
    });

    await inMemoryStorageRepository.create(storage1);
    await inMemoryStorageRepository.create(storage2);

    const orderSale = await useCase.execute({
      items: [
        {
          productId: product1.id,
          costPerUnit: 2.5,
          amount: 50,
        },
        {
          productId: product2.id,
          costPerUnit: 10,
          amount: 2,
        },
      ],
    });

    expect(orderSale.id).toBeInstanceOf(UniqueEntityID);
    expect(orderSale.items).toHaveLength(2);
    expect(orderSale.total).toEqual(145);

    const updatedStorage1 = await inMemoryStorageRepository.findByProductId(
      product1.id,
    );
    const updatedStorage2 = await inMemoryStorageRepository.findByProductId(
      product2.id,
    );

    expect(updatedStorage1?.amount).toEqual(50);
    expect(updatedStorage2?.amount).toEqual(48);
  });
});
