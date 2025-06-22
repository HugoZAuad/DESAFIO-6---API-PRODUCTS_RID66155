import { Order } from "@modules/orders/infra/database/entities/Orders";

export interface ICreateSale {
  order: Order;
  products: {
    stock_id: number;
    quantity: number;
  }[];
}
