import { DataSource, Repository } from "typeorm";
import { Sale } from "../entities/Sale";
import { ISalesRepositories } from "@modules/sales/domains/repositories/ISalesRepositories";
import { ICreateSale } from "@modules/sales/domains/interfaces/ICreateSale";
import { ISale } from "@modules/sales/domains/interfaces/ISale";
import { injectable, inject } from "tsyringe";

@injectable()
export default class SalesRepositories implements ISalesRepositories {
  private ormRepository: Repository<Sale>;

  constructor(
    @inject("dataSource")
    dataSource: DataSource
  ) {
    this.ormRepository = dataSource.getRepository(Sale);
  }

  public async create(data: ICreateSale): Promise<ISale> {
    const orderRepository = this.ormRepository.manager.getRepository("orders");

    const order = await orderRepository.findOneBy({ id: data.order_id! });
    if (!order) {
      throw new Error("Order not found");
    }

    const sale = this.ormRepository.create({
      order: order,
      sale_stocks: data.products.map(product => ({
        stock: { id: product.stock_id },
        quantity: product.quantity,
      })),
    });

    await this.ormRepository.save(sale);
    return sale;
  }

  public async checkOrderExists(order_id: number): Promise<boolean> {
    const orderRepository = this.ormRepository.manager.getRepository("orders");
    const order = await orderRepository.findOneBy({ id: order_id });
    return !!order;
  }

  public async findById(id: number): Promise<ISale | null> {
    const sale = await this.ormRepository.findOne({
      where: { id },
      relations: ['order', 'sale_stocks', 'sale_stocks.stock'],
    });
    return sale || null;
  }

  public async list(): Promise<ISale[]> {
    const sales = await this.ormRepository.find({
      relations: ['order', 'sale_stocks', 'sale_stocks.stock'],
    });
    return sales;
  }
}
