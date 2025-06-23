import AppError from "@shared/errors/AppError"  
import { ICustomerRepositories } from "@modules/customers/domains/repositories/ICreateCustomerRepositories"
import { IUpdateCustomer } from "@modules/customers/domains/interfaces/IUpdateCustomer"
import { Customer } from "@modules/customers/infra/database/entities/Customers"
import { inject, injectable } from "tsyringe"

@injectable()
export default class UpdateCustomerService {
  constructor(
    @inject("customerRepositories")
    private customerRepositories: ICustomerRepositories
  ) { }

  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    if (!name || !email) {
      throw new AppError("Nome e email são obrigatórios", 400)
    }
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
