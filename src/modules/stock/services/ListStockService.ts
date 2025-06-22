import { inject, injectable } from "tsyringe";
import { IStockRepositories } from "@modules/stock/domains/repositories/IStockRepositories";
import { IStock } from "@modules/stock/domains/interfaces/IStock";

@injectable()
export class ListStockService {
  constructor(
    @inject("stockRepositories")
    private stockRepositories: IStockRepositories
  ) {}

  public async execute(): Promise<IStock[]> {
    const stocks = await this.stockRepositories.list();
    return stocks;
  }
}
