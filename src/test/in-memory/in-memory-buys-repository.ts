import type { Buy } from "@/domain/entities/buy";
import type { BuysRepository } from "@/domain/repositories/buy-repository";

export class InMemoryBuysRepository implements BuysRepository {
  public items: Buy[] = [];

  async create(buy: Buy): Promise<void> {
    this.items.push(buy);
  }
}
