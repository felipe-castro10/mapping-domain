import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface SaleProps {
  productId: UniqueEntityID;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Sale extends Entity<SaleProps> {
  get productId() {
    return this.props.productId;
  }
  get amount() {
    return this.props.amount;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<SaleProps, "createdAt">, id?: UniqueEntityID) {
    const sale = new Sale(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return sale;
  }
}
