import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SalesRepository } from "../repositories/sale-repository";
import { Sale, type SaleItem } from "../entities/sale";
import type { StoragesRepository } from "../repositories/storage-repository";

interface OrdemItemRequest {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
}

interface CreateOrderSaleUseCaseRequest {
  items: OrdemItemRequest[];
}

export class CreateOrderSaleUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storagesRepository: StoragesRepository,
    private salesRepository: SalesRepository,
  ) {}

  async execute({ items }: CreateOrderSaleUseCaseRequest) {
    if (!items || items.length === 0) {
      throw new Error("At least one item is required to create a sale.");
    }

    const saleItems: SaleItem[] = [];

    for (const item of items) {
      const product = await this.productsRepository.findById(item.productId);

      if (!product) {
        throw new Error(
          `Product with ID ${item.productId.toString()} not found!`,
        );
      }

      const storage = await this.storagesRepository.findByProductId(
        item.productId,
      );

      if (!storage) {
        throw new Error(`Product ${product.name} does not have stock record.`);
      }

      if (item.amount > storage.amount) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${storage.amount}, Requested: ${item.amount}`,
        );
      }

      saleItems.push({
        productId: product.id,
        amount: item.amount,
        costPerUnit: item.costPerUnit,
      });
    }

    for (const item of items) {
      const storage = await this.storagesRepository.findByProductId(
        item.productId,
      );

      if (storage) {
        storage.amount = storage.amount - item.amount;
        await this.storagesRepository.save(storage);
      }
    }

    const orderSale = Sale.create({
      items: saleItems,
    });

    await this.salesRepository.create(orderSale);

    return orderSale;
  }
}
