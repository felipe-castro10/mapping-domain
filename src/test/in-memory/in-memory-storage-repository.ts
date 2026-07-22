import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Storage } from "@/domain/entities/storage";
import type { StoragesRepository } from "@/domain/repositories/storage-repository";

export class InMemoryStorageRepository implements StoragesRepository {
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
