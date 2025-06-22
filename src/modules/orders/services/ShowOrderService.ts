import AppError from "@shared/errors/AppError"
import { Order } from "@modules/orders/infra/database/entities/Orders"
import { IOrderRepositories } from "@modules/orders/domains/repositories/ICreateOrderRepositories"
import { inject, injectable } from "tsyringe"

@injectable()
export class ShowOrderService {
  constructor(@inject('orderRepositories') private readonly orderRepositories: IOrderRepositories) { }

  async execute(id: number): Promise<Order> {
    const order = await this.orderRepositories.findById(Number(id))

    if (!order) {
      throw new AppError("Pedido não encontrado")
    }

    return order
  }
}