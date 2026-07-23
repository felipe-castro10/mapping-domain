import { MetricsSaleUseCase } from "@/domain/use-cases/metrics-sale";
import { InMemoryProductsRepository } from "../in-memory/in-memory-products-repository";
import { InMemorySalesRepository } from "../in-memory/in-memory-sales-repository";
import { InMemoryStorageRepository } from "../in-memory/in-memory-storage-repository";
import { Product } from "@/domain/entities/product";
import { Storage } from "@/domain/entities/storage";
import { Sale } from "@/domain/entities/sale";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryStorageRepository: InMemoryStorageRepository;
let inMemorySalesRepository: InMemorySalesRepository;
let useCase: MetricsSaleUseCase;

describe("Metrics Sale Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStorageRepository = new InMemoryStorageRepository();
    inMemorySalesRepository = new InMemorySalesRepository();

    useCase = new MetricsSaleUseCase(
      inMemoryProductsRepository,
      inMemorySalesRepository,
      inMemoryStorageRepository,
    );
  });

  test("should be able to calculate sales metrics and stock trends for a period", async () => {
    const product1 = Product.create({
      name: "Sabonete",
      description: "Sabonete muito bom",
      minStorage: 10,
    });

    const product2 = Product.create({
      name: "Shampoo",
      description: "Shampoo cheiroso",
      minStorage: 20,
    });

    await inMemoryProductsRepository.create(product1);
    await inMemoryProductsRepository.create(product2);

    const storage1 = Storage.create({
      productId: product1.id,
      amount: 5,
    });

    const storage2 = Storage.create({
      productId: product2.id,
      amount: 25,
    });

    await inMemoryStorageRepository.create(storage1);
    await inMemoryStorageRepository.create(storage2);

    const sale1 = Sale.create({
      items: [
        {
          productId: product1.id,
          amount: 10,
          costPerUnit: 2.5,
        },
      ],
      createdAt: new Date(2026, 0, 15),
    });

    const sale2 = Sale.create({
      items: [
        {
          productId: product1.id,
          amount: 2,
          costPerUnit: 2.5,
        },
        {
          productId: product2.id,
          amount: 5,
          costPerUnit: 10,
        },
      ],
      createdAt: new Date(2026, 0, 20),
    });

    await inMemorySalesRepository.create(sale1);
    await inMemorySalesRepository.create(sale2);

    const result = await useCase.execute({
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 0, 31),
    });

    expect(result.totalSalesCount).toEqual(2);
    expect(result.totalRevenue).toEqual(80);

    expect(result.topSellingProducts[0].productId).toEqual(product1.id);
    expect(result.topSellingProducts[0].totalQuantitySold).toEqual(12);
    expect(result.topSellingProducts[1].productId).toEqual(product2.id);
    expect(result.topSellingProducts[1].totalQuantitySold).toEqual(5);

    const saboneteTrend = result.stockTrends.find(
      (s) => s.productId.toValue() === product1.id.toValue(),
    );

    const shampooTrend = result.stockTrends.find(
      (s) => s.productId.toValue() === product2.id.toValue(),
    );
    expect(saboneteTrend?.stockStatus).toEqual("CRITICAL");
    expect(shampooTrend?.stockStatus).toEqual("WARNING");
  });
});
