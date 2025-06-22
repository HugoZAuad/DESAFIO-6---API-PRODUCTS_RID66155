import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Customer } from "../entities/Customers"
import { ICustomerRepositories, Pagination } from "@modules/customers/domains/repositories/ICreateCustomerRepositories"
import { ICreateCustomer } from "@modules/customers/domains/interfaces/ICreateCustomer"
import { ICustomer } from "@modules/customers/domains/interfaces/ICustomer"
import { Repository } from "typeorm"

export default class customerRepositories implements ICustomerRepositories {
  private ormRepository: Repository<Customer>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Customer)
  }
  
  async find(): Promise<ICustomer[]> {
    const customers = await this.ormRepository.find();
    return customers;
  }

  async findByName(name: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      name,
    })
    return customer
  }

  async findById(id: number): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      id,
    })
    return customer
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      email
    })
    return customer
  }

  async create({name, email}: ICreateCustomer): Promise<ICustomer> {
    const customer = this.ormRepository.create({name, email})
    await this.ormRepository.save(customer)
    return customer
  }

  async save(customer: ICustomer): Promise<ICustomer>{
    await this.ormRepository.save(customer)
    return customer
  }

  async remove(customer: ICustomer): Promise<void>{
    await this.ormRepository.remove(customer)
    return
  }

  async findAndCount({take, skip}:Pagination): Promise<[ICustomer[], number]> {
    const [customers, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    })
    return [customers, total]
  }

}
