import { inject, injectable } from "tsyringe";
import { ICreateStock } from "../domains/interfaces/ICreateStock";
import { IStock } from "../domains/interfaces/IStock";
import { IStockRepository } from "../domains/repositories/IStockRepository";

@injectable()
export class CreateStockService {
  constructor(
    @inject("StockRepository")
    private stockRepository: IStockRepository
  ) {}

  public async execute(data: ICreateStock): Promise<IStock> {
    const stock = await this.stockRepository.create(data);
    return stock;
  }
}
