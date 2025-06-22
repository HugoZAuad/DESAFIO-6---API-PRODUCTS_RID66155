import { StockMovementType } from "@modules/stock/infra/database/entities/Stock";

export interface ICreateStock {
  product_id: number;
  quantity: number;
  movement_type: StockMovementType;
}
