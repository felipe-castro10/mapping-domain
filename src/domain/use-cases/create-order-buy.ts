import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SupliersRepository } from "../repositories/suplier-repository";
import { Buy, type BuyItem } from "../entities/buy";
import type { BuysRepository } from "../repositories/buy-repository";
import type { StoragesRepository } from "../repositories/storage-repository";

interface OrdemItemRequest {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
}

interface CreateOrderBuyUseCaseRequest {
  items: OrdemItemRequest[];
  deliveryDate: Date;
  suplierId: UniqueEntityID;
}

export class CreateOrderBuyUseCase {
  constructor(
    private productsRepositors: ProductsRepository,
    private supliersRepositors: SupliersRepository,
    private buysRepositors: BuysRepository,
  ) {}

  async execute({ items, deliveryDate }: CreateOrderBuyUseCaseRequest) {
    if (!items || items.length === 0) {
      throw new Error("At least one product is required to create a buy");
    }

    const buyItems: BuyItem[] = [];

    for (const item of items) {
      const product = await this.productsRepositors.findById(item.productId);

      if (!product) {
        throw new Error(
          `Product with ID ${item.productId.toString()} not found!`,
        );
      }
    }
  }
}
