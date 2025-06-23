import { inject, injectable } from 'tsyringe';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import AppError from '@shared/errors/AppError';

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface IPagination {
  current_Page: number;
  data: Customer[];
  next_page: number | null;
  per_page: number;
  prev_page: number | null;
  total: number;
  total_pages: number;
}

@injectable()
class ListCustomerService {
  constructor(
    @inject('customerRepositories')
    private customerRepositories: ICustomerRepositories,
  ) {}

  public async execute(page: number, perPage: number): Promise<IPagination> {
    const [customers, total] = await this.customerRepositories.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    if (total === 0) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return {
      current_Page: page,
      data: customers as Customer[],
      total,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
      next_page: page < Math.ceil(total / perPage) ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };
  }
}

export default ListCustomerService;
