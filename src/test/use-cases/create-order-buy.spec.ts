import { CreateOrderBuyUseCase } from "@/domain/use-cases/create-order-buy";
import { InMemoryBuysRepository } from "../in-memory/in-memory-buys-repository";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySupiersRepository } from "../in-memory/in-memory-suplier-repository";
import { Product } from "@/domain/entities/product";
import { Suplier } from "@/domain/entities/suplier";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemorySupliersRepository: InMemorySupiersRepository;
let inMemoryBuysRepository: InMemoryBuysRepository;
let useCase: CreateOrderBuyUseCase;

describe("Create Order Buy Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemorySupliersRepository = new InMemorySupiersRepository();
    inMemoryBuysRepository = new InMemoryBuysRepository();

    useCase = new CreateOrderBuyUseCase(
      inMemoryProductsRepository,
      inMemorySupliersRepository,
      inMemoryBuysRepository,
    );
  });

  test("should be able to create an order buy with multiple items", async () => {
    const product = Product.create({
      name: "Sabonete",
      description: "Sabonete muito bom",
      minStorage: 10,
    });

    const suplier = Suplier.create({
      name: "Sabonetes LTDA",
      cnpj: "12345678910",
      address: "Rua teste",
    });

    await inMemoryProductsRepository.create(product);
    await inMemorySupliersRepository.create(suplier);

    const orderBuy = await useCase.execute({
      items: [
        {
          productId: product.id,
          costPerUnit: 2.5,
          amount: 100,
          deliveryDate: new Date(),
          suplierId: suplier.id,
        },
      ],
    });

    expect(orderBuy.id).toBeInstanceOf(UniqueEntityID);
    expect(orderBuy.items).toHaveLength(1);
    expect(orderBuy.total).toEqual(250);
    expect(orderBuy.items[0].productId.equals(product.id)).toBe(true);
    expect(inMemoryBuysRepository.items).toHaveLength(1);
  });

  test("should not be able to create an order buy without items", async () => {
    await expect(() =>
      useCase.execute({
        items: [],
      }),
    ).rejects.toThrow("At least one product is required to create a buy");
  });

  test("should not be able to create an order buy with a non-existing product", async () => {
    const suplier = Suplier.create({
      name: "Sabonetes LTDA",
      cnpj: "12345678910",
      address: "Rua teste",
    });

    await inMemorySupliersRepository.create(suplier);

    await expect(() =>
      useCase.execute({
        items: [
          {
            productId: new UniqueEntityID("inexistent-product-id"),
            costPerUnit: 2.5,
            amount: 100,
            deliveryDate: new Date(),
            suplierId: suplier.id,
          },
        ],
      }),
    ).rejects.toThrow();
  });

  test("should not be able to create an order buy with a non-existing supplier", async () => {
    const product = Product.create({
      name: "Sabonete",
      description: "Sabonete muito bom",
      minStorage: 10,
    });

    await inMemoryProductsRepository.create(product);

    await expect(() =>
      useCase.execute({
        items: [
          {
            productId: product.id,
            costPerUnit: 2.5,
            amount: 100,
            deliveryDate: new Date(),
            suplierId: new UniqueEntityID("inexistent-supplier-id"),
          },
        ],
      }),
    ).rejects.toThrow();
  });
});
