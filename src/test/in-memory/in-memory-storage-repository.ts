import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Product } from "@/domain/entities/product";
import type { Storage } from "@/domain/entities/storage";
import type { StoragesRepository } from "@/domain/repositories/storage-repository";

export class InMemoryStorageRepository implements StoragesRepository {
  async fetchStorage(): Promise<Storage[] | null> {
    if (!this.items) {
      return null;
    }

    return this.items;
  }

  public items: Storage[] = [];

  async create(storage: Storage): Promise<void> {
    this.items.push(storage);
  }

  async save(storage: Storage): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === storage.id);

    if (itemIndex >= 0) {
      this.items[itemIndex] = storage;
    } else {
      this.items.push(storage);
    }
  }

  async findByProductId(productId: UniqueEntityID): Promise<Storage | null> {
    const findStorageByProductId = await this.items.find(
      (items) => items.productId === productId,
    );

    if (!findStorageByProductId) {
      return null;
    }

    return findStorageByProductId;
  }
}
