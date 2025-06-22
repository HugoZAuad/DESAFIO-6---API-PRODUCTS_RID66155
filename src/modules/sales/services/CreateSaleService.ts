import { inject, injectable } from "tsyringe";
import { ICreateSale } from "../domains/interfaces/ICreateSale";
import { ISale } from "../domains/interfaces/ISale";
import { ISalesRepository } from "../domains/repositories/ISalesRepository";
import { IStockRepository } from "@modules/stock/domains/repositories/IStockRepository";
import { StockMovementType } from "@modules/stock/infra/database/entities/Stock";
import { ICreateStock } from "@modules/stock/domains/interfaces/ICreateStock";

@injectable()
export class CreateSaleService {
  constructor(
    @inject("SalesRepository")
    private salesRepository: ISalesRepository,

    @inject("StockRepository")
    private stockRepository: IStockRepository
  ) {}

  public async execute(data: ICreateSale): Promise<ISale> {

    const sale = await this.salesRepository.create(data);

    for (const product of data.products) {
      const stockData: ICreateStock = {
        product_id: product.stock_id,
        quantity: product.quantity,
        movement_type: StockMovementType.OUT,
      };
      await this.stockRepository.create(stockData);
    }

    return sale;
  }
}
