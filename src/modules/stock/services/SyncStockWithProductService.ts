import { inject, injectable } from "tsyringe";
import { IStockRepositories } from "../domains/repositories/IStockRepositories";
import { ICreateStock } from "../domains/interfaces/ICreateStock";
import { StockMovementType } from "../infra/database/entities/Stock";
import { IProduct } from "@modules/products/domains/interfaces/IProduct";

@injectable()
export class SyncStockWithProductService {
  constructor(
    @inject("stockRepositories")
    private stockRepositories: IStockRepositories
  ) {}

  public async execute(product: IProduct): Promise<void> {
    const existingStock = await this.stockRepositories.findByProductId(product.id);

    const stockData: ICreateStock = {
      product: { id: product.id },
      product_name: product.name ?? "",
      quantity: product.quantity,
      movement_type: StockMovementType.IN,
    };

    if (existingStock) {
      existingStock.product_name = stockData.product_name ?? "";
      existingStock.quantity = stockData.quantity;
      existingStock.movement_type = stockData.movement_type;
      await this.stockRepositories.update(existingStock);
    } else {

      await this.stockRepositories.create(stockData);
    }
  }
}
