import { Customer } from "@modules/customers/infra/database/entities/Customers"
import { ICreateOrderProducts } from "@modules/orders/domains/interfaces/ICreateOrderProducts"

export interface ICreateOrder{
  customer: Customer
  products: ICreateOrderProducts[]
}