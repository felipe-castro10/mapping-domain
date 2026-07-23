import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Storage } from "../entities/storage";
import type { ProductsRepository } from "../repositories/product-repository";
import type { StoragesRepository } from "../repositories/storage-repository";

interface MinAmountItems {
  storageId: UniqueEntityID;
  productId: UniqueEntityID;
  productName: string;
  actualAmount: number;
  minStorage: number;
}

interface StoragesItems {
  storageId: UniqueEntityID;
  productId: UniqueEntityID;
  productName: string;
  actualAmount: number;
}

interface FetchStoragesWithMinAmountsResponse {
  storagesItems: StoragesItems[];
  minAmountStorages: MinAmountItems[];
}

export class FetchStoragesWithMinAmounts {
  constructor(
    private productsRepository: ProductsRepository,
    private storageRepository: StoragesRepository,
  ) {}

  async execute(): Promise<FetchStoragesWithMinAmountsResponse> {
    const minAmountStorages: MinAmountItems[] = [];
    const storagesItems: StoragesItems[] = [];

    const storages = await this.storageRepository.fetchStorage();

    if (!storages) {
      throw new Error("Storages not found!");
    }

    for (const storage of storages) {
      const product = await this.productsRepository.findById(storage.productId);

      if (!product) {
        continue;
      }

      if (storage.amount <= product.minStorage) {
        minAmountStorages.push({
          storageId: storage.id,
          productId: product.id,
          productName: product.name,
          actualAmount: storage.amount,
          minStorage: product.minStorage,
        });
      }

      storagesItems.push({
        storageId: storage.id,
        productId: product.id,
        productName: product.name,
        actualAmount: storage.amount,
      });
    }

    return {
      storagesItems,
      minAmountStorages,
    };
  }
}
