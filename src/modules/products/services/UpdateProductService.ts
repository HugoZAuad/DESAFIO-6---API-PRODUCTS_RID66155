import AppError from "@shared/errors/AppError";
import { Product } from "@modules/products/infra/database/entities/Product";
import { IUpdateProductService } from "@modules/products/domains/interfaces/IUpdateProductService"
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class UpdateProductService {
  constructor(@inject('productsRepositories') private readonly productsRepositories: IProductRepositories) { }

  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProductService): Promise<Product> {
    const product = await this.productsRepositories.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const productExists = await this.productsRepositories.findByName(name);

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepositories.save(product)

    return product;
  }
}
