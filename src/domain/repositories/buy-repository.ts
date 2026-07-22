import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Buy } from "../entities/buy";

export interface BuysRepository {
  create(buy: Buy): Promise<void>;
  findById(id: UniqueEntityID): Promise<Buy | null>;
  save(buy: Buy): Promise<void>;
}
