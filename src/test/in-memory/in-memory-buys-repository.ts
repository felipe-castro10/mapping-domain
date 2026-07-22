import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Buy } from "@/domain/entities/buy";
import type { BuysRepository } from "@/domain/repositories/buy-repository";

export class InMemoryBuysRepository implements BuysRepository {
  public items: Buy[] = [];
  async findById(id: UniqueEntityID): Promise<Buy | null> {
    const findBuy = this.items.find((item) => item.id === id);

    if (!findBuy) {
      return null;
    }

    return findBuy;
  }

  async save(buy: Buy): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === buy.id);

    if (itemIndex >= 0) {
      this.items[itemIndex] = buy;
    } else {
      this.items.push(buy);
    }
  }

  async create(buy: Buy): Promise<void> {
    this.items.push(buy);
  }
}
