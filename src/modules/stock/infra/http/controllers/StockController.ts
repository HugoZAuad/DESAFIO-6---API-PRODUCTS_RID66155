import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListStockService } from "@modules/stock/services/ListStockService";

export class StockController {
  public async list(request: Request, response: Response): Promise<Response> {
    const listStockService = container.resolve(ListStockService);
    const stocks = await listStockService.execute();
    return response.json(stocks);
  }
}
