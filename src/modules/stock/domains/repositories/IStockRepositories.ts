import { IStock } from "../interfaces/IStock";
import { ICreateStock } from "../interfaces/ICreateStock";

export interface IStockRepositories {
  create(data: ICreateStock): Promise<IStock>;
  findById(id: number): Promise<IStock | null>;
  list(): Promise<IStock[]>;
  update(stock: IStock): Promise<IStock>;

  findByProductId(product_id: number): Promise<IStock | null>;
}
