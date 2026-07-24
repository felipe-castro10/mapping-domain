import { FetchStoragesWithMinAmounts } from "@/domain/use-cases/fetch-storages-with-min-amount";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { Storage } from "@/domain/entities/storage";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryStoragesRepository: InMemoryStorageRepository;
let useCase: FetchStoragesWithMinAmounts;

describe("Fech storages with min amoun", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStoragesRepository = new InMemoryStorageRepository();

    useCase = new FetchStoragesWithMinAmounts(
      inMemoryProductsRepository,
      inMemoryStoragesRepository,
    );
  });

  test("fetch storages with min amount", async () => {
    const product = Product.create({
      name: "Sabonete",
      description: "Sabonete muito bom",
      minStorage: 10,
    });

    const product2 = Product.create({
      name: "Shampoo",
      description: "Shampoo muito bom",
      minStorage: 5,
    });

    await inMemoryProductsRepository.create(product);
    await inMemoryProductsRepository.create(product2);

    const storage = Storage.create({
      productId: product.id,
      amount: 12,
    });

    const storage2 = Storage.create({
      productId: product2.id,
      amount: 4,
    });

    await inMemoryStoragesRepository.create(storage);
    await inMemoryStoragesRepository.create(storage2);

    const fetch = await useCase.execute();

    expect(fetch.storagesItems).toHaveLength(2);
    expect(fetch.minAmountStorages).toHaveLength(1);
    expect(fetch.storagesItems).toEqual([
      expect.objectContaining({ productName: "Sabonete" }),
      expect.objectContaining({ productName: "Shampoo" }),
    ]);
  });
});
