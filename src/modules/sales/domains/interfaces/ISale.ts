import { Order } from "@modules/orders/infra/database/entities/Orders";
import { SaleStock } from "@modules/sales/infra/database/entities/SaleStock";

export interface ISale {
  id: number;
  order: Order;
  sale_stocks: SaleStock[];
  created_at: Date;
  updated_at: Date;
}
