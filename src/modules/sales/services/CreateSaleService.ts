import AppError from "@shared/errors/AppError";
import { ICreateSale } from "../domains/interfaces/ICreateSale";
import { ISale } from "../domains/interfaces/ISale";
import { ISalesRepositories } from "../domains/repositories/ISalesRepositories";
import { IStockRepositories } from "@modules/stock/domains/repositories/IStockRepositories";
import { StockMovementType } from "@modules/stock/infra/database/entities/Stock";
import { ICreateStock } from "@modules/stock/domains/interfaces/ICreateStock";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateSaleService {
  constructor(
    @inject("salesRepositories")
    private salesRepositories: ISalesRepositories,

    @inject("stockRepositories")
    private stockRepositories: IStockRepositories
  ) {}

  public async execute(data: ICreateSale): Promise<ISale> {
    if (!data.order_id) {
      throw new AppError("order_id é obrigatório para criar uma venda");
    }

    if (!data.products || data.products.length === 0) {
      throw new AppError("Nenhum produto informado para a venda");
    }

    const orderExists = await this.salesRepositories.checkOrderExists(data.order_id);
    if (!orderExists) {
      throw new AppError("Pedido (order) não encontrado");
    }

    const saleData = {
      order: { id: Number(data.order_id) },
      products: data.products,
    };

    const sale = await this.salesRepositories.create(saleData);

    for (const product of data.products) {
      if (!product.stock_id || !product.quantity) {
        throw new AppError("Produto inválido na venda");
      }

      const stockExists = await this.stockRepositories.findById(product.stock_id);
      if (!stockExists) {
        throw new AppError(`Estoque com id ${product.stock_id} não encontrado`);
      }

      if (stockExists.quantity < product.quantity) {
        throw new AppError(`Quantidade insuficiente no estoque para o produto com stock_id ${product.stock_id}`);
      }

      const stockData: ICreateStock = {
        product: stockExists.product,
        product_name: stockExists.product.name,
        quantity: product.quantity,
        movement_type: StockMovementType.OUT,
      };
      await this.stockRepositories.create(stockData);

      stockExists.quantity -= product.quantity;
      await this.stockRepositories.update(stockExists);
    }

    return sale;
  }
}
