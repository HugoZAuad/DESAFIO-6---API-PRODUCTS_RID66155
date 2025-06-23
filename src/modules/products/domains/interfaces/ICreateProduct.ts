import { OrdersProducts } from "@modules/orders/infra/database/entities/OrdersProducts"

export interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
  order_products?: OrdersProducts[];
}