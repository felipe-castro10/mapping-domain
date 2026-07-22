import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Suplier } from "../entities/suplier";

export interface SupliersRepository {
  create(suplier: Suplier): Promise<void>;
  findById(id: UniqueEntityID): Promise<Suplier | null>;
}
