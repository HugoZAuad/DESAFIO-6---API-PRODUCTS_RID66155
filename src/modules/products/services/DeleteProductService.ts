import AppError from "@shared/errors/AppError"
import { IDeleteProduct } from "@modules/products/domains/interfaces/IDeleteProduct"
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class DeleteProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) {}
  
  async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await this.productsRepositories.findById(id)
    
    if (!product) {
      throw new AppError("Produto não encontrado", 404)
    }

    await this.productsRepositories.remove(product)
  }
}