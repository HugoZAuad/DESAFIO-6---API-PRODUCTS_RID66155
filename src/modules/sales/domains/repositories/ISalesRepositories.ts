import { ISale } from "../interfaces/ISale";
import { ICreateSale } from "../interfaces/ICreateSale";

export interface ISalesRepositories {
  create(data: ICreateSale): Promise<ISale>;
  findById(id: number): Promise<ISale | null>;
  list(): Promise<ISale[]>;
  checkOrderExists(order_id: number): Promise<boolean>;
}
