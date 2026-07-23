import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface BuyItem {
  productId: UniqueEntityID;
  amount: number;
  costPerUnit: number;
  suplierId: UniqueEntityID;
  deliveryDate: Date;
}

interface BuyProps {
  items: BuyItem[];
  total: number;
  receiptDate?: Date;
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

  get receiptDate() {
    return this.props.receiptDate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set receiptDate(receiptDate) {
    this.props.receiptDate = receiptDate;
    this.props.updatedAt = new Date();
  }

  private calcTotal() {
    this.props.total = this.props.items.reduce((acc, item) => {
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
