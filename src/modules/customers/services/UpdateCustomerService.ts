import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import { IUpdateCustomer } from "@modules/customers/domains/interfaces/IUpdateCustomer"
import { ICustomerRepositories } from "@modules/customers/domains/repositories/ICreateCustomerRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class UpdateCustomerService {
  constructor(@inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) { }

  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    
    const customer = await this.customerRepositories.findById(id)

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }

    const customerExists = await this.customerRepositories.findByEmail(email)

    if (customerExists && customerExists.id !== id) {
      throw new AppError("Já tem um cliente com este e-mail", 409)
    }

    customer.name = name
    customer.email = email

    await this.customerRepositories.save(customer)

    return customer
  }
}
