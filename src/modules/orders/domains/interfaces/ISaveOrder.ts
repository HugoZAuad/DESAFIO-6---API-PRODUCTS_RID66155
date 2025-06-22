import { ICustomer } from "@modules/customers/domains/interfaces/ICustomer";

export interface IOrderProduct {
  product_id: string;
  price: number;
  quantity: number;
}

export interface ISaveOrder {
  customer_id: string;
  customer?: ICustomer;
  order_products: IOrderProduct[];
}
