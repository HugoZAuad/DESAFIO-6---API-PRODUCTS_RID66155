import { IProduct } from '@modules/products/domains/interfaces/IProduct';
import { ICreateProduct } from "@modules/products/domains/interfaces/ICreateProduct";

export interface Pagination {
  take: number;
  skip: number;
}

export interface IProductRepositories {
  findAllByIds(ids: number[]): Promise<IProduct[]>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(product: IProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
  findById(id: number): Promise<IProduct | null>;
  findByName(name: string): Promise<IProduct | null>;
  find(): Promise<IProduct[]>;
  findAndCount(pagination: Pagination): Promise<[IProduct[], number]>;
}
