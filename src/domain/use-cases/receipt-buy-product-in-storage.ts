import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { BuysRepository } from "../repositories/buy-repository";
import type { StoragesRepository } from "../repositories/storage-repository";

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

    findBuy.receiptDate = new Date();

    this.buysRepository.save(findBuy);

    const findStorage = await this.storageRepository.findByProductId(
      findBuy.productId,
    );

    if (!findStorage) {
      throw new Error("Storage not found");
    }

    findStorage.amount = findStorage.amount + findBuy.amount;

    this.storageRepository.save(findStorage);

    return {
      findBuy,
      findStorage,
    };
  }
}
