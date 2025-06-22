import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories'
import customerRepositories from '@modules/customers/infra/database/repositories/CustomersRepositories'
import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories'
import orderRepositories from '@modules/orders/infra/database/repositories/OrderRepositories'
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories'
import productRepositories from '@modules/products/infra/database/repositories/ProductsRepositories'
import { container } from 'tsyringe'
import { DataSource } from 'typeorm'
import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { ISalesRepositories } from '@modules/sales/domains/repositories/ISalesRepositories'
import salesRepositories from '@modules/sales/infra/database/repositories/SalesRepositories'
import { IStockRepositories } from '@modules/stock/domains/repositories/IStockRepositories'
import StockRepositories from '@modules/stock/infra/database/repositories/StockRepositories'
import { SyncStockWithProductService } from '@modules/stock/services/SyncStockWithProductService'

container.registerInstance<DataSource>('dataSource', AppDataSource)

container.registerSingleton<ICustomerRepositories>(
  'customerRepositories', customerRepositories
)

container.registerSingleton<IOrderRepositories>(
  'orderRepositories', orderRepositories
)

container.registerSingleton<IProductRepositories>(
  'productRepositories', productRepositories
)

container.registerSingleton<ISalesRepositories>(
  'salesRepositories', salesRepositories
)

container.registerSingleton<IStockRepositories>(
  'stockRepositories', StockRepositories
)

container.registerSingleton<SyncStockWithProductService>(
  'SyncStockWithProductService', SyncStockWithProductService
)
