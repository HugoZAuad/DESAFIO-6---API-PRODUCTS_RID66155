import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Product } from "@modules/products/infra/database/entities/Product";
import { IProductRepositories, Pagination } from "@modules/products/domains/repositories/ICreateProductRepositories";
import { ICreateProduct } from "@modules/products/domains/interfaces/ICreateProduct";
import { IProduct } from "@modules/products/domains/interfaces/IProduct";
import { In, Repository } from "typeorm";

export class ProductRepositories implements IProductRepositories {
    private ormRepository: Repository<Product>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Product);
    }

    async findAllByIds(ids: number[]): Promise<IProduct[]> {
        return await this.ormRepository.find({
            where: { id: In(ids) },
        });
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

    async findById(id: number): Promise<IProduct | null> {
        return await this.ormRepository.findOneBy({ id });
    }

    async findByName(name: string): Promise<IProduct | null> {
        return await this.ormRepository.findOneBy({ name });
    }

    async find(): Promise<IProduct[]> {
        return await this.ormRepository.find();
    }

    async findAndCount({ take, skip }: Pagination): Promise<[IProduct[], number]> {
        return await this.ormRepository.findAndCount({ take, skip });
    }
}
    