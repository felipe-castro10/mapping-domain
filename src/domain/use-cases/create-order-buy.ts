import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SupliersRepository } from "../repositories/suplier-repository";
import { Buy } from "../entities/buy";
import type { BuysRepository } from "../repositories/buy-repository";

interface CreateOrderBuyUseCaseRequest {
  productId: UniqueEntityID;
  amount: number;
  deliverTime: Date;
  suplierId: UniqueEntityID;
}

export class CreateOrderBuyUseCase {
  constructor(
    private productsRepositors: ProductsRepository,
    private supliersRepositors: SupliersRepository,
    private buysRepositors: BuysRepository,
  ) {}

  async execute({
    productId,
    amount,
    deliverTime,
    suplierId,
  }: CreateOrderBuyUseCaseRequest) {
    const findProduct = await this.productsRepositors.findById(productId);

    if (!findProduct) {
      throw new Error("Product ID is not exists!");
    }

    const findSuplier = await this.supliersRepositors.findById(suplierId);

    if (!findSuplier) {
      throw new Error("Suplier not exists!");
    }

    const orderBuy = Buy.create({
      productId,
      amount,
      deliverTime,
      suplierId,
    });

    await this.buysRepositors.create(orderBuy);

    return orderBuy;
  }
}
