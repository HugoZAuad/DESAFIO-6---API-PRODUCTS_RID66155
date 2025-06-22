import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories'
import customerRepositories from '@modules/customers/infra/database/repositories/CustomersRepositories'
import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories'
import orderRepositories from '@modules/orders/infra/database/repositories/OrderRepositories'
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories'
import productRepositories from '@modules/products/infra/database/repositories/ProductsRepositories'
import { container } from 'tsyringe'

container.registerSingleton<ICustomerRepositories>(
  'customerRepositories', customerRepositories
)

container.registerSingleton<IOrderRepositories>(
  'orderRepositories', orderRepositories
)

container.registerSingleton<IProductRepositories>(
  'productRepositories', productRepositories
)
