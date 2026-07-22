import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SupliersRepository } from "../repositories/suplier-repository";
import { Buy } from "../entities/buy";
import type { BuysRepository } from "../repositories/buy-repository";
import type { StoragesRepository } from "../repositories/storage-repository";

interface CreateOrderBuyUseCaseRequest {
  productId: UniqueEntityID;
  amount: number;
  deliveryDate: Date;
  suplierId: UniqueEntityID;
  storageId?: UniqueEntityID;
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
    deliveryDate,
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
      deliveryDate,
      suplierId,
    });

    await this.buysRepositors.create(orderBuy);

    return orderBuy;
  }
}
