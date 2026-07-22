import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Suplier } from "@/domain/entities/suplier";
import type { SupliersRepository } from "@/domain/repositories/suplier-repository";

export class InMemorySupiersRepository implements SupliersRepository {
  public items: Suplier[] = [];

  async findById(id: UniqueEntityID): Promise<Suplier | null> {
    const suplier = await this.items.find((suplier) => suplier.id === id);

    if (!suplier) {
      return null;
    }

    return suplier;
  }

  async create(suplier: Suplier): Promise<void> {
    this.items.push(suplier);
  }
}
