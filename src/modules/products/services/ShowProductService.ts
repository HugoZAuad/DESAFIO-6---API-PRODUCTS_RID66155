import AppError from '@shared/errors/AppError'
import { Product } from '@modules/products/infra/database/entities/Product'
import { IShowProduct } from '@modules/products/domains/interfaces/IShowProduct'
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories'
import { injectable, inject } from 'tsyringe'

@injectable()
export default class ShowProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) {}

  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await this.productsRepositories.findById(id)

    if (!product) {
      throw new AppError('Produtos não encontrados', 404)
    }

    return product
  }
}
