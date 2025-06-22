import { Request, Response, NextFunction } from "express"
import { CreateSaleService } from "@modules/sales/services/CreateSaleService"
import { ListSaleService } from "@modules/sales/services/ListSaleService"
import { createSaleValidate } from "../schemas/SalesSchemas"
import { container } from "tsyringe"

export class SalesController {
  public async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    createSaleValidate(request, response, async (err) => {
      if (err) {
        console.error("Validation error:", err)
        return next(err)
      }

      try {
        const { order_id, products } = request.body

        console.log("SalesController - order_id:", order_id)

        if (!order_id) {
          return response.status(400).json({ message: "order_id é obrigatório" })
        }

        const createSaleService = container.resolve(CreateSaleService)

        const sale = await createSaleService.execute({
          order_id,
          products,
        })

        return response.status(201).json(sale)
      } catch (error) {
        console.error("CreateSaleService error:", error)
        return next(error)
      }
    })
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listSaleService = container.resolve(ListSaleService);
    const sales = await listSaleService.execute();
    return response.json(sales);
  }
}
