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

test("create an order buy", async () => {
  inMemoryProductsRepository = new InMemoryProductsRepository();
  inMemorySupliersRepository = new InMemorySupiersRepository();
  inMemoryBuysRepository = new InMemoryBuysRepository();

  const useCase = new CreateOrderBuyUseCase(
    inMemoryProductsRepository,
    inMemorySupliersRepository,
    inMemoryBuysRepository,
  );

  const product = Product.create({
    name: "sabonete",
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
    productId: product.id,
    amount: 100,
    deliveryDate: new Date(),
    suplierId: suplier.id,
  });

  expect(orderBuy.id).toBeInstanceOf(UniqueEntityID);
  expect(orderBuy.amount).toEqual(100);
});

test("Create buy with destiny storage", async () => {});
