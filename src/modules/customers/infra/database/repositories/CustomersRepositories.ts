import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Customer } from "@modules/customers/infra/database/entities/Customers";
import { ICustomerRepositories, Pagination } from "@modules/customers/domains/repositories/ICreateCustomerRepositories";
import { ICreateCustomer } from "@modules/customers/domains/interfaces/ICreateCustomer";
import { ICustomer } from "@modules/customers/domains/interfaces/ICustomer";
import { Repository } from "typeorm";

export class CustomerRepositories implements ICustomerRepositories {
    private ormRepository: Repository<Customer>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Customer);
    }

    async find(): Promise<ICustomer[]> {
        return await this.ormRepository.find();
    }

    async findByName(name: string): Promise<ICustomer | null> {
        return await this.ormRepository.findOneBy({ name });
    }

    async findById(id: number): Promise<ICustomer | undefined> {
        return await this.ormRepository.findOneBy({ id }) || undefined;
    }

    async findByEmail(email: string): Promise<ICustomer | null> {
        return await this.ormRepository.findOneBy({ email });
    }

    async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
        const customer = this.ormRepository.create({ name, email });
        await this.ormRepository.save(customer);
        return customer;
    }

    async save(customer: Customer): Promise<void> {
        await this.ormRepository.save(customer);
    }

    async remove(customer: ICustomer): Promise<void> {
        await this.ormRepository.remove(customer);
    }

    async findAndCount({ take, skip }: Pagination): Promise<[ICustomer[], number]> {
        return await this.ormRepository.findAndCount({ take, skip });
    }
}
