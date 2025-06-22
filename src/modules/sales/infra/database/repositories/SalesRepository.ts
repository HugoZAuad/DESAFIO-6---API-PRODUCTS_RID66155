import { DataSource, Repository } from "typeorm";
import { Sale } from "../entities/Sale";
import { ISalesRepository } from "@modules/sales/domains/repositories/ISalesRepository";
import { ICreateSale } from "@modules/sales/domains/interfaces/ICreateSale";
import { ISale } from "@modules/sales/domains/interfaces/ISale";

export class SalesRepository implements ISalesRepository {
  private ormRepository: Repository<Sale>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Sale);
  }

  public async create(data: ICreateSale): Promise<ISale> {
    const sale = this.ormRepository.create({
      order: data.order,
      sale_stocks: data.products.map(product => ({
        stock: { id: product.stock_id },
        quantity: product.quantity,
      })),
    });

    await this.ormRepository.save(sale);
    return sale;
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
