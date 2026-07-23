import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface SaleItem {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
}

interface SaleProps {
  items: SaleItem[];
  total: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Sale extends Entity<SaleProps> {
  get items() {
    return this.props.items;
  }

  get total() {
    return this.props.total;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private calcTotal() {
    this.props.total = this.props.items.reduce((acc, item) => {
      return acc + item.costPerUnit * item.amount;
    }, 0);
  }

  static create(
    props: Optional<SaleProps, "createdAt" | "total">,
    id?: UniqueEntityID,
  ) {
    const sale = new Sale(
      {
        ...props,
        total: props.total ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    sale.calcTotal();

    return sale;
  }
}
