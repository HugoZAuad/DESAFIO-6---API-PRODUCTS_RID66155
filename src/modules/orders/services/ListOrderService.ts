import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories';
import { IOrder } from '@modules/orders/domains/interfaces/IOrder';
import { inject, injectable } from 'tsyringe';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrderRepositories,
  ) {}

  public async execute({ page, limit }: SearchParams): Promise<IOrder[]> {
    const take = limit;
    const skip = (Number(page) - 1) * take;
    const orders = await this.ordersRepository.findAll({
      skip,
      take,
    });

    return orders;
  }
}

export default ListOrderService;
