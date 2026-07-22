import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SalesRepository } from "../repositories/sale-repository";
import { Sale } from "../entities/sale";
import type { StoragesRepository } from "../repositories/storage-repository";

interface CreateOrderSaleUseCaseRequest {
  productId: UniqueEntityID;
  amount: number;
}

export class CreateOrderSaleUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storagesRepository: StoragesRepository,
    private salesRepository: SalesRepository,
  ) {}

  async execute({ productId, amount }: CreateOrderSaleUseCaseRequest) {
    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new Error("Product not found!");
    }

    const findStorage =
      await this.storagesRepository.findByProductId(productId);

    if (!findStorage) {
      throw new Error("Product not have amount in storage");
    }

    if (amount > findStorage.amount) {
      throw new Error(
        "The quantity in storage is less than the requested amount.",
      );
    }

    findStorage.amount = findStorage.amount - amount;

    await this.storagesRepository.save(findStorage);

    const orderSale = Sale.create({
      productId,
      amount,
    });

    await this.salesRepository.create(orderSale);

    return orderSale;
  }
}
