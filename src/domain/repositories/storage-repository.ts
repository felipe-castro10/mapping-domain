import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Storage } from "../entities/storage";

export interface StoragesRepository {
  create(storage: Storage): Promise<void>;
  save(storage: Storage): Promise<void>;
  findByProductId(productId: UniqueEntityID): Promise<Storage | null>;
}
