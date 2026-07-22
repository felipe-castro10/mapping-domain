import { ReceiptBuyProductInStorageUseCase } from "@/domain/use-cases/receipt-buy-product-in-storage";
import { InMemoryBuysRepository } from "../in-memory/in-memory-buys-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { Product } from "@/domain/entities/product";
import { Buy } from "@/domain/entities/buy";
import { Suplier } from "@/domain/entities/suplier";
import { InMemorySupiersRepository } from "../in-memory/in-memory-suplier-repository";
import { Storage } from "@/domain/entities/storage";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemorySupiersRepository: InMemorySupiersRepository;
let inMemoryBuysRepository: InMemoryBuysRepository;
let inMemoryStorageRepository: InMemoryStorageRepository;

test("Receipt an product in storage if the product as receipt", async () => {
  inMemoryProductsRepository = new InMemoryProductsRepository();
  inMemorySupiersRepository = new InMemorySupiersRepository();
  inMemoryBuysRepository = new InMemoryBuysRepository();
  inMemoryStorageRepository = new InMemoryStorageRepository();

  const useCase = new ReceiptBuyProductInStorageUseCase(
    inMemoryBuysRepository,
    inMemoryStorageRepository,
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

  const orderBuy = Buy.create({
    productId: product.id,
    amount: 10,
    suplierId: suplier.id,
    deliveryDate: new Date(),
  });

  const storage = Storage.create({
    productId: product.id,
    amount: 100,
  });

  await inMemoryProductsRepository.create(product);
  await inMemorySupiersRepository.create(suplier);
  await inMemoryBuysRepository.create(orderBuy);
  await inMemoryStorageRepository.create(storage);

  const receipt = await useCase.execute({ buyId: orderBuy.id });

  expect(receipt.findBuy.deliverTime).instanceof(Date);
  expect(receipt.findStorage.amount).toEqual(110);
});
