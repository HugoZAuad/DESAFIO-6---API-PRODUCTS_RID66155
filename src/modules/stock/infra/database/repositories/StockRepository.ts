import { DataSource, Repository } from "typeorm";
import { Stock } from "../entities/Stock";
import { IStockRepository } from "@modules/stock/domains/repositories/IStockRepository";
import { ICreateStock } from "@modules/stock/domains/interfaces/ICreateStock";
import { IStock } from "@modules/stock/domains/interfaces/IStock";

export class StockRepository implements IStockRepository {
  private ormRepository: Repository<Stock>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Stock);
  }

  public async create(data: ICreateStock): Promise<IStock> {
    const stock = this.ormRepository.create(data);
    await this.ormRepository.save(stock);
    return stock;
  }

  public async findById(id: number): Promise<IStock | null> {
    const stock = await this.ormRepository.findOne({ where: { id }, relations: ['product'] });
    return stock || null;
  }

  public async list(): Promise<IStock[]> {
    const stocks = await this.ormRepository.find({ relations: ['product'] });
    return stocks;
  }

  public async update(stock: IStock): Promise<IStock> {
    await this.ormRepository.save(stock);
    return stock;
  }
}
