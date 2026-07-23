import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Sale } from "@/domain/entities/sale";
import type { SalesRepository } from "@/domain/repositories/sale-repository";

export class InMemorySalesRepository implements SalesRepository {
  public items: Sale[] = [];

  async fetchByPeriod(startDate: Date, endDate: Date): Promise<Sale[] | null> {
    const fetch = this.items.filter((sale) => {
      const saleTime = sale.createdAt.getTime();
      return saleTime >= startDate.getTime() && saleTime <= endDate.getTime();
    });

    if (!fetch) {
      return null;
    }

    return fetch;
  }

  async create(sale: Sale): Promise<void> {
    this.items.push(sale);
  }
  async findById(id: UniqueEntityID): Promise<Sale | null> {
    const findSale = await this.items.find((item) => item.id === id);

    if (!findSale) {
      return null;
    }

    return findSale;
  }
}
