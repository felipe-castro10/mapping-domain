import { Suplier } from "../entities/suplier";
import type { SupliersRepository } from "../repositories/suplier-repository";

interface CadSuplierUseCaseRequest {
  name: string;
  cnpj: string;
  address: string;
}

export class CadSuplierUseCase {
  constructor(private supliersRepository: SupliersRepository) {}

  async execute({ name, cnpj, address }: CadSuplierUseCaseRequest) {
    const suplier = Suplier.create({
      name,
      cnpj,
      address,
    });

    await this.supliersRepository.create(suplier);

    return suplier;
  }
}
