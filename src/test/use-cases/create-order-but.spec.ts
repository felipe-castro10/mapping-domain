import { CreateOrderBuyUseCase } from "@/domain/use-cases/create-order-buy";
import { InMemoryBuysRepository } from "../in-memory/in-memory-buys-repository";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySupiersRepository } from "../in-memory/in-memory-suplier-repository";

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

  const orderBuy = await useCase.execute({});
});
