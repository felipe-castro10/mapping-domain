import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface StorageProps {
  productId: UniqueEntityID;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Storage extends Entity<StorageProps> {
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

  set amount(amount: number) {
    this.props.amount = amount;
    this.touch();
  }

  private updateAmount(amount: number, type: "DESC" | "ASC") {
    if (type === "DESC") {
      this.props.amount = this.props.amount - amount;
      this.touch();
    }

    if (type === "ASC") {
      this.props.amount = this.props.amount + amount;
      this.touch();
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<StorageProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const storage = new Storage(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return storage;
  }
}
