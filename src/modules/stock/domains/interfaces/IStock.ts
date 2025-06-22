import { Product } from "@modules/products/infra/database/entities/Product";
import { StockMovementType } from "@modules/stock/infra/database/entities/Stock";

export interface IStock {
  id: number;
  product: Product;
  quantity: number;
  movement_type: StockMovementType;
  created_at: Date;
  updated_at: Date;
}
