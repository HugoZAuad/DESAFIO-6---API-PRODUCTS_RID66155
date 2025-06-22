import AppError from "@shared/errors/AppError"
import { IDeleteCustomer } from "@modules/customers/domains/interfaces/IDeleteCustomer"
import { ICustomerRepositories } from "@modules/customers/domains/repositories/ICreateCustomerRepositories"
import { inject, injectable } from "tsyringe"

@injectable()
export default class DeleteCustomerService {
  constructor(@inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) {}
  
  async execute({ id }: IDeleteCustomer): Promise<void> {

    const customer = await this.customerRepositories.findById(id)

    if (!customer) {
      throw new AppError("Clienten não encontrado.", 404)
    }

    await this.customerRepositories.remove(customer)
  }
}