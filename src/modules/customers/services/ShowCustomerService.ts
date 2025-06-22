import AppError from "@shared/errors/AppError"
import { Customer } from "@modules/customers/infra/database/entities/Customers"
import { IShowCustomer } from "@modules/customers/domains/interfaces/IShowCustomer"
import { ICustomerRepositories } from "@modules/customers/domains/repositories/ICreateCustomerRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ShowCustomerService {
  constructor(@inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) { }
  
  async execute({ id }: IShowCustomer): Promise<Customer> {

    const customer = await this.customerRepositories.findById(id)

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }

    return customer
  }
}