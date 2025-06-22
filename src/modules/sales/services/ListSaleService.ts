import { inject, injectable } from "tsyringe";
import { ISalesRepositories } from "../domains/repositories/ISalesRepositories";
import { ISale } from "../domains/interfaces/ISale";

@injectable()
export class ListSaleService {
  constructor(
    @inject("salesRepositories")
    private salesRepositories: ISalesRepositories
  ) {}

  public async execute(): Promise<ISale[]> {
    const sales = await this.salesRepositories.list();
    return sales;
  }
}
