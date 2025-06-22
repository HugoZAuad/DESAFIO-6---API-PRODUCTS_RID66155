import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Order } from "@modules/orders/infra/database/entities/Orders"
import { IOrder } from "@modules/orders/domains/interfaces/IOrder"
import { IOrderRepositories } from "@modules/orders/domains/repositories/ICreateOrderRepositories"
import { ISaveOrder } from "@modules/orders/domains/interfaces/ISaveOrder"
import { Repository } from "typeorm"

export default class orderRepositories implements IOrderRepositories {
  private ormRepository: Repository<Order>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order)
  }

  async findById(id: number): Promise<IOrder | null> {
    const order = await this.ormRepository.findOneBy({
      id,
    })
    return order
  }

  async create({customer_id, order_products}: ISaveOrder): Promise<IOrder> {
    const SaveOrder = this.ormRepository.create({
      customer: { id: Number(customer_id) },
      order_products,
    })
    await this.ormRepository.save(SaveOrder)
    return SaveOrder
  }

  async save(order: IOrder): Promise<IOrder>{
    await this.ormRepository.save(order)
    return order
  }

  async findAll({ skip, take }: { skip: number; take: number }): Promise<IOrder[]> {
    const orders = await this.ormRepository.find({
      skip,
      take,
      relations: ['customer', 'order_products'],
    })
    return orders
  }
}
