import { StockMovementType } from "@modules/stock/infra/database/entities/Stock";

export interface ICreateStock {
  product?: { id: number };
  product_id?: number;
  product_name?: string;
  quantity: number;
  movement_type: StockMovementType;
}
