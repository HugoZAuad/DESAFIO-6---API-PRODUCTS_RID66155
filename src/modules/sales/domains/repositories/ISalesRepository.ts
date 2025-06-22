import { ISale } from "../interfaces/ISale";
import { ICreateSale } from "../interfaces/ICreateSale";

export interface ISalesRepository {
  create(data: ICreateSale): Promise<ISale>;
  findById(id: number): Promise<ISale | null>;
  list(): Promise<ISale[]>;
}
