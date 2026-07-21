import type { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface SuplierProps {
  name: string;
  cnpj: number;
  adress: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Suplier extends Entity<SuplierProps> {
  get name() {
    return this.props.name;
  }
  get cnpj() {
    return this.props.cnpj;
  }
  get adress() {
    return this.props.adress;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<SuplierProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const suplier = new Suplier(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return suplier;
  }
}
