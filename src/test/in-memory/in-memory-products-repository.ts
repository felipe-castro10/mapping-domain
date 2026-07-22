import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Product } from "@/domain/entities/product";
import type { ProductsRepository } from "@/domain/repositories/product-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async findById(id: UniqueEntityID): Promise<Product | null> {
    const product = this.items.find((product) => product.id === id);

    if (!product) {
      return null;
    }

    return product;
  }
}
