import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface ProductProps {
  name: string;
  description: string;
  minStorage: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get minStorage() {
    return this.props.minStorage;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  set minimunStorage(minStorage: number) {
    this.props.minStorage = minStorage;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ProductProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return product;
  }
}
