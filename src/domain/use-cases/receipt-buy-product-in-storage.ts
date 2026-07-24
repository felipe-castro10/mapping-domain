import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { BuysRepository } from "../repositories/buy-repository";
import type { StoragesRepository } from "../repositories/storage-repository";
import type { Storage } from "../entities/storage";

interface ReceiptBuyProductInStorageUseCaseRequest {
  buyId: UniqueEntityID;
}

export class ReceiptBuyProductInStorageUseCase {
  constructor(
    private buysRepository: BuysRepository,
    private storageRepository: StoragesRepository,
  ) {}

  async execute({ buyId }: ReceiptBuyProductInStorageUseCaseRequest) {
    const findBuy = await this.buysRepository.findById(buyId);

    if (!findBuy) {
      throw new Error("Buy not found!");
    }

    if (findBuy.finishReceipt) {
      throw new Error("This buy order has already been received.");
    }

    const updatedStorages: Storage[] = [];

    for (const item of findBuy.items) {
      const findStorage = await this.storageRepository.findByProductId(
        item.productId,
      );

      if (!findStorage) {
        throw new Error(
          `Storage not found for product ID ${item.productId.toString()}`,
        );
      }

      findStorage.amount = findStorage.amount + item.amount;

      item.receiptDate = new Date();

      await this.storageRepository.save(findStorage);

      updatedStorages.push(findStorage);
    }

    findBuy.markAsReceived();
    await this.buysRepository.save(findBuy);

    return {
      buy: findBuy,
      storages: updatedStorages,
    };
  }
}
