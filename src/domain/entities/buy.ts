import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface BuyItem {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
  suplierId: UniqueEntityID;
  deliveryDate: Date;
  receiptDate?: Date;
}

interface BuyProps {
  items: BuyItem[];
  total: number;
  finishReceipt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class Buy extends Entity<BuyProps> {
  get items() {
    return this.props.items;
  }

  get total() {
    return this.props.total;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  private calcTotal() {
    this.props.total = (this.props.items ?? []).reduce((acc, item) => {
      return acc + item.costPerUnit * item.amount;
    }, 0);
  }

  static create(
    props: Optional<BuyProps, "createdAt" | "total">,
    id?: UniqueEntityID,
  ) {
    const buy = new Buy(
      {
        ...props,
        total: props.total ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    buy.calcTotal();

    return buy;
  }
}
