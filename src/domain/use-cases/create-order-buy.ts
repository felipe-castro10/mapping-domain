import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SupliersRepository } from "../repositories/suplier-repository";
import { Buy, type BuyItem } from "../entities/buy";
import type { BuysRepository } from "../repositories/buy-repository";

interface OrdemItemRequest {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
  deliveryDate: Date;
  suplierId: UniqueEntityID;
}

interface CreateOrderBuyUseCaseRequest {
  items: OrdemItemRequest[];
}

export class CreateOrderBuyUseCase {
  constructor(
    private productsRepositors: ProductsRepository,
    private supliersRepositors: SupliersRepository,
    private buysRepositors: BuysRepository,
  ) {}

  async execute({ items }: CreateOrderBuyUseCaseRequest) {
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

      const suplier = await this.supliersRepositors.findById(item.suplierId);

      if (!suplier) {
        throw new Error(
          `Necessary declared suplier in product ID ${product.id}`,
        );
      }

      buyItems.push({
        productId: product.id,
        amount: item.amount,
        costPerUnit: item.costPerUnit,
        deliveryDate: item.deliveryDate,
        suplierId: item.suplierId,
      });
    }

    const orderBuy = Buy.create({
      items: buyItems,
    });

    await this.buysRepositors.create(orderBuy);

    return orderBuy;
  }
}
