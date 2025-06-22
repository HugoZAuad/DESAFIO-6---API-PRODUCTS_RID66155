import { ISaveOrder } from '@modules/orders/domains/interfaces/ISaveOrder';
import { IOrder } from "@modules/orders/domains/interfaces/IOrder"

export interface IOrderRepositories {
  create(data: ISaveOrder): Promise<IOrder>
  save(customer: IOrder): Promise<IOrder>
  findById(id: number): Promise<IOrder | null>
  findAll(params: { skip: number; take: number }): Promise<IOrder[]>
}
