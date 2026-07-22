import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Sale } from "../entities/sale";

export interface SalesRepository {
  create(sale: Sale): Promise<void>;
  findById(id: UniqueEntityID): Promise<Sale | null>;
}
