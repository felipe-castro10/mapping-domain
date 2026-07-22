import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { StoragesRepository } from "../repositories/storage-repository";
import type { ProductsRepository } from "../repositories/product-repository";
import { Storage } from "../entities/storage";

interface CreateStorageUseCaseRequest {
  productId: UniqueEntityID;
  amount: number;
}

export class CreateStorageUseCase {
  constructor(
    private productsRepositors: ProductsRepository,
    private storagesRepositors: StoragesRepository,
  ) {}

  async execute({ productId, amount }: CreateStorageUseCaseRequest) {
    const findProduct = await this.productsRepositors.findById(productId);

    if (!findProduct) {
      throw new Error("Product not found!");
    }

    const findStorageByProductId =
      await this.storagesRepositors.findByProductId(productId);

    if (findStorageByProductId) {
      throw new Error("Storage with product declared alrealy exists.");
    }

    const storage = Storage.create({
      productId,
      amount,
    });

    await this.storagesRepositors.create(storage);

    return storage;
  }
}
