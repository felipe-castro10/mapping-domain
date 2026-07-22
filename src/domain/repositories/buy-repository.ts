import type { Buy } from "../entities/buy";

export interface BuysRepository {
  create(buy: Buy): Promise<void>;
}
