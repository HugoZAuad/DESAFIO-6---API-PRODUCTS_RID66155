import AppError from '@shared/errors/AppError'
import { IPagination } from "@shared/interfaces/PaginationInterface"
import { Product } from "@modules/products/infra/database/entities/Product"
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ListProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) { }

  async execute(page: number = 1, limit: number = 10): Promise<IPagination<Product>> {

    if (!Product) {
      throw new AppError('Produtos não encontrados', 404)
    }

    const [data, total] = await this.productsRepositories.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      per_page: limit,
      current_Page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    } as IPagination<Product>
  }
}