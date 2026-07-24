import { ReceiptBuyProductInStorageUseCase } from "@/domain/use-cases/receipt-buy-product-in-storage";
import { InMemoryBuysRepository } from "../in-memory/in-memory-buys-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { Suplier } from "@/domain/entities/suplier";
import { Storage } from "@/domain/entities/storage";
import { Buy } from "@/domain/entities/buy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryBuysRepository: InMemoryBuysRepository;
let inMemoryStorageRepository: InMemoryStorageRepository;
let useCase: ReceiptBuyProductInStorageUseCase;

describe("Receipt Buy Product In Storage Use Case", () => {
  beforeEach(() => {
    inMemoryBuysRepository = new InMemoryBuysRepository();
    inMemoryStorageRepository = new InMemoryStorageRepository();

    useCase = new ReceiptBuyProductInStorageUseCase(
      inMemoryBuysRepository,
      inMemoryStorageRepository,
    );
  });

  test("should be able to receive products from buy order and update storage", async () => {
    const productId1 = new UniqueEntityID();
    const productId2 = new UniqueEntityID();
    const suplierId = new UniqueEntityID();

    const storage1 = Storage.create({
      productId: productId1,
      amount: 10,
    });

    const storage2 = Storage.create({
      productId: productId2,
      amount: 5,
    });

    await inMemoryStorageRepository.create(storage1);
    await inMemoryStorageRepository.create(storage2);

    const buy = Buy.create({
      items: [
        {
          productId: productId1,
          amount: 50,
          costPerUnit: 2.5,
          suplierId,
          deliveryDate: new Date(),
        },
        {
          productId: productId2,
          amount: 20,
          costPerUnit: 10,
          suplierId,
          deliveryDate: new Date(),
        },
      ],
    });

    await inMemoryBuysRepository.create(buy);

    const result = await useCase.execute({
      buyId: buy.id,
    });

    expect(result.buy.finishReceipt).toBeInstanceOf(Date);
    expect(result.buy.items[0].receiptDate).toBeInstanceOf(Date);
    expect(result.buy.items[1].receiptDate).toBeInstanceOf(Date);

    const updatedStorage1 =
      await inMemoryStorageRepository.findByProductId(productId1);
    expect(updatedStorage1?.amount).toEqual(60);

    const updatedStorage2 =
      await inMemoryStorageRepository.findByProductId(productId2);
    expect(updatedStorage2?.amount).toEqual(25);
  });

  test("should not be able to receive a non-existing buy order", async () => {
    await expect(() =>
      useCase.execute({
        buyId: new UniqueEntityID("inexistent-buy-id"),
      }),
    ).rejects.toThrow("Buy not found!");
  });

  test("should not be able to receive the same buy order twice", async () => {
    const productId = new UniqueEntityID();
    const suplierId = new UniqueEntityID();

    const storage = Storage.create({
      productId,
      amount: 10,
    });

    await inMemoryStorageRepository.create(storage);

    const buy = Buy.create({
      items: [
        {
          productId,
          amount: 20,
          costPerUnit: 5,
          suplierId,
          deliveryDate: new Date(),
        },
      ],
    });

    await inMemoryBuysRepository.create(buy);

    await useCase.execute({ buyId: buy.id });

    await expect(() =>
      useCase.execute({
        buyId: buy.id,
      }),
    ).rejects.toThrow("This buy order has already been received.");
  });

  test("should not be able to receive buy order if product does not have storage record", async () => {
    const productIdWithoutStorage = new UniqueEntityID();
    const suplierId = new UniqueEntityID();

    const buy = Buy.create({
      items: [
        {
          productId: productIdWithoutStorage,
          amount: 10,
          costPerUnit: 5,
          suplierId,
          deliveryDate: new Date(),
        },
      ],
    });

    await inMemoryBuysRepository.create(buy);

    await expect(() =>
      useCase.execute({
        buyId: buy.id,
      }),
    ).rejects.toThrow(
      `Storage not found for product ID ${productIdWithoutStorage.toString()}`,
    );
  });
});
