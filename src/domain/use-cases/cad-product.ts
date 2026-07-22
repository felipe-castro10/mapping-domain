import { Product } from "../entities/product";
import type { ProductsRepository } from "../repositories/product-repository";

interface CadProductUseCaseRequest {
  name: string;
  description: string;
  minStorage: number;
}

export class CadProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ name, description, minStorage }: CadProductUseCaseRequest) {
    const product = Product.create({
      name,
      description,
      minStorage,
    });

    await this.productsRepository.create(product);

    return product;
  }
}
