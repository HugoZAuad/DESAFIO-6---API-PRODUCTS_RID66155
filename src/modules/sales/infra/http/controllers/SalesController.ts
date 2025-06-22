import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSaleService } from "@modules/sales/services/CreateSaleService";

export class SalesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { order, products } = request.body;

    const createSaleService = container.resolve(CreateSaleService);

    const sale = await createSaleService.execute({
      order,
      products,
    });

    return response.status(201).json(sale);
  }
}
