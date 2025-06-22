import AppError from "@shared/errors/AppError"
import { IDeleteProduct } from "@modules/products/domains/interfaces/IDeleteProduct"
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"
import { SyncStockWithProductService } from "@modules/stock/services/SyncStockWithProductService";

@injectable()
export default class DeleteProductService {
  constructor(
    @inject('productRepositories') private readonly productsRepositories: IProductRepositories,
    @inject('SyncStockWithProductService') private readonly syncStockWithProductService: SyncStockWithProductService
  ) {}
  
  async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await this.productsRepositories.findById(id)
    
    if (!product) {
      throw new AppError("Produto não encontrado", 404)
    }

    await this.productsRepositories.remove(product)
  
    await this.syncStockWithProductService.execute(product);
  }
}
