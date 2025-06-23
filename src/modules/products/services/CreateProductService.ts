import AppError from "@shared/errors/AppError";
import { Product } from "@modules/products/infra/database/entities/Product";
import { ICreateProduct } from "@modules/products/domains/interfaces/ICreateProduct";
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories";
import { injectable, inject } from "tsyringe";
import { SyncStockWithProductService } from "@modules/stock/services/SyncStockWithProductService";

@injectable()
export default class CreateProductService {
  constructor(
    @inject('productRepositories') private readonly productsRepositories: IProductRepositories,
    @inject('SyncStockWithProductService') private readonly syncStockWithProductService: SyncStockWithProductService
  ) {}

  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    try {
      if (!name || price === undefined || quantity === undefined) {
        throw new AppError("Nome, preço e quantidade são obrigatórios", 400);
      }

      if (price < 0) {
        throw new AppError("Preço não pode ser negativo", 400);
      }

      if (quantity <= 0) {
        throw new AppError("Quantidade deve ser maior que zero", 400);
      }

      const productExists = await this.productsRepositories.findByName(name);

      if (productExists) {
        throw new AppError("Já existe um produto com esse nome", 409);
      }

      const product = await this.productsRepositories.create({
        name,
        price,
        quantity,
        order_products: [], 
      });

      await this.syncStockWithProductService.execute(product);

      return product;
    } catch (error) {
      console.error("Erro no CreateProductService:", error);
      throw error instanceof AppError ? error : new AppError("Erro ao criar produto", 500);
    }
  }
}
