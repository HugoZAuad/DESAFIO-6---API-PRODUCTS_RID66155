import { DataSource, Repository } from "typeorm";
import { Stock } from "../entities/Stock";
import { IStockRepositories } from "@modules/stock/domains/repositories/IStockRepositories";
import { ICreateStock } from "@modules/stock/domains/interfaces/ICreateStock";
import { IStock } from "@modules/stock/domains/interfaces/IStock";
import { injectable, inject } from "tsyringe";

@injectable()
export default class StockRepositories implements IStockRepositories {
  private ormRepository: Repository<Stock>;

  constructor(
    @inject("dataSource")
    dataSource: DataSource
  ) {
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

  public async findByProductId(product_id: number): Promise<IStock | null> {
    const stock = await this.ormRepository.findOne({ where: { product: { id: product_id } }, relations: ['product'] });
    return stock || null;
  }
}
