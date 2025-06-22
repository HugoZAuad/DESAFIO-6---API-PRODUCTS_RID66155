import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Product } from "@modules/products/infra/database/entities/Product"
import { IProduct } from "@modules/products/domains/interfaces/IProduct"
import { IProductRepositories, Pagination } from "@modules/products/domains/repositories/ICreateProductRepositories"
import { ICreateProduct } from "@modules/products/domains/interfaces/ICreateProduct"
import { In, Repository } from "typeorm"

export default class ProductRepositories implements IProductRepositories {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product)
  }
  async find(): Promise<IProduct[]> {
    const products = await this.ormRepository.find();
    return products;
  }
  async findAndCount({take, skip}:Pagination): Promise<[IProduct[], number]> {
    const [product, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    })
    return [product, total]
  }

  async findAllByIds(ids: number[]): Promise<IProduct[]> {
    const existentProducts = await this.ormRepository.find({
      where: { id: In(ids) },
    });
    return existentProducts;
  }

  async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      name,
    });
    return product;
  }

  async findById(id: number): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      id,
    });
    return product;
  }

  async create(data: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create(data);
    await this.ormRepository.save(product);
    return product;
  }

  async save(product: IProduct): Promise<IProduct> {
    await this.ormRepository.save(product);
    return product;
  }

  async remove(product: IProduct): Promise<void> {
    await this.ormRepository.remove(product);
  }
}
