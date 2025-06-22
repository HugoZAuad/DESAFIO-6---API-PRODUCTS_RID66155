import { inject, injectable } from "tsyringe";
import { ICreateStock } from "../domains/interfaces/ICreateStock";
import { IStock } from "../domains/interfaces/IStock";
import { IStockRepositories } from "../domains/repositories/IStockRepositories";

@injectable()
export class CreateStockService {
  constructor(
    @inject("StockRepositories")
    private stockRepositories: IStockRepositories
  ) {}

  public async execute(data: ICreateStock): Promise<IStock> {
    const stock = await this.stockRepositories.create(data);
    return stock;
  }
}
