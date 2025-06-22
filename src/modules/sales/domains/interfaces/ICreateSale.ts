export interface ICreateSale {
  order_id?: number;
  order?: {
    id: number;
  };
  products: {
    stock_id: number;
    quantity: number;
  }[];
}
