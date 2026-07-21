import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface BuyProps {
  productId: UniqueEntityID;
  amount: number;
  deliverTime: Date;
  suplierId: UniqueEntityID;
  createdAt: Date;
}

export class Buy extends Entity<BuyProps> {
  get productId() {
    return this.props.productId;
  }
  get amount() {
    return this.props.amount;
  }
  get deliverTime() {
    return this.props.deliverTime;
  }
  get suplierId() {
    return this.props.suplierId;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<BuyProps, "createdAt">, id?: UniqueEntityID) {
    const buy = new Buy(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return buy;
  }
}
