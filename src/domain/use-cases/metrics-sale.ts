import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { ProductsRepository } from "../repositories/product-repository";
import type { SalesRepository } from "../repositories/sale-repository";
import type { StoragesRepository } from "../repositories/storage-repository";

export interface MetricsSaleRequest {
  startDate: Date;
  endDate: Date;
}

export interface ProductMetrics {
  productId: UniqueEntityID;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface StockTrend {
  productId: UniqueEntityID;
  productName: string;
  currentStock: number;
  stockStatus: "CRITICAL" | "WARNING" | "OK";
}

export interface MetricsSaleResponse {
  period: { startDate: Date; endDate: Date };
  totalSalesCount: number;
  totalRevenue: number;
  totalProfit: number;
  productMetrics: ProductMetrics[];
  topSellingProducts: ProductMetrics[];
  stockTrends: StockTrend[];
}

export class MetricsSaleUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private salesRepository: SalesRepository,
    private storagesRepository: StoragesRepository,
  ) {}

  async execute({
    startDate,
    endDate,
  }: MetricsSaleRequest): Promise<MetricsSaleResponse> {
    const sales = await this.salesRepository.fetchByPeriod(startDate, endDate);
    console.log(sales);

    if (!sales) {
      throw new Error("Sales not found!");
    }

    const metricsMap = new Map<string, ProductMetrics>();
    let totalRevenue = 0;
    let totalProfit = 0;

    for (const sale of sales) {
      for (const item of sale.items) {
        const product = await this.productsRepository.findById(item.productId);
        if (!product) continue;

        const productIdKey = product.id.toString();

        const itemRevenue = item.costPerUnit * item.amount;

        const productCost = (product as any).costPrice ?? 0;
        const itemCostTotal = productCost * item.amount;
        const itemProfit = itemRevenue - itemCostTotal;

        totalRevenue += itemRevenue;
        totalProfit += itemProfit;

        const existingMetric = metricsMap.get(productIdKey);

        if (existingMetric) {
          existingMetric.totalQuantitySold += item.amount;
          existingMetric.totalRevenue += itemRevenue;
          existingMetric.totalProfit += itemProfit;
        } else {
          metricsMap.set(productIdKey, {
            productId: product.id,
            productName: product.name,
            totalQuantitySold: item.amount,
            totalRevenue: itemRevenue,
            totalProfit: itemProfit,
          });
        }
      }
    }

    const productMetrics = Array.from(metricsMap.values());

    const topSellingProducts = [...productMetrics].sort(
      (a, b) => b.totalQuantitySold - a.totalQuantitySold,
    );

    const storages = await this.storagesRepository.fetchStorage();

    if (!storages) {
      throw new Error("Storage not found");
    }

    const stockTrends: StockTrend[] = [];

    for (const storage of storages) {
      const product = await this.productsRepository.findById(storage.productId);
      if (!product) continue;

      let stockStatus: "CRITICAL" | "WARNING" | "OK" = "OK";

      if (storage.amount <= product.minStorage) {
        stockStatus = "CRITICAL";
      } else if (storage.amount <= product.minStorage * 1.5) {
        stockStatus = "WARNING";
      }

      stockTrends.push({
        productId: product.id,
        productName: product.name,
        currentStock: storage.amount,
        stockStatus,
      });
    }

    return {
      period: { startDate, endDate },
      totalSalesCount: sales.length,
      totalRevenue,
      totalProfit,
      productMetrics,
      topSellingProducts,
      stockTrends,
    };
  }
}
