import { ICreateCustomer } from "@modules/customers/domains/interfaces/ICreateCustomer"
import { ICustomer } from "@modules/customers/domains/interfaces/ICustomer"
import { Customer } from "@modules/customers/infra/database/entities/Customers"

export interface Pagination {
  take: number
  skip: number
}

export interface ICustomerRepositories {
  find(): Promise<ICustomer[]>;
  findByEmail(email: string): Promise<ICustomer | null>;
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(customer: Customer): Promise<Customer | void>;
  remove(customer: ICustomer): Promise<void>;
  findById(id: number): Promise<ICustomer | undefined>;
  findAndCount(pagination: Pagination): Promise<[ICustomer[], number]>;
  findByName(name: string): Promise<ICustomer | null>;
}
