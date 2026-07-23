import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Product } from "../entities/product";

export interface ProductsRepository {
  create(product: Product): Promise<void>;
  findById(id: UniqueEntityID): Promise<Product | null>;
  fetchProducts(): Promise<Product[] | null>;
}
