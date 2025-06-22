import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStockService } from "@modules/stock/services/CreateStockService";

export class StockController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { product_id, quantity, movement_type } = request.body;

    const createStockService = container.resolve(CreateStockService);

    const stock = await createStockService.execute({
      product_id,
      quantity,
      movement_type,
    });

    return response.status(201).json(stock);
  }
}
