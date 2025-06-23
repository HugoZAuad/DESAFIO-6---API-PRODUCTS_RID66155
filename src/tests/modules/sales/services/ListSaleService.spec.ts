import 'reflect-metadata';
import { container } from 'tsyringe';
import { ListSaleService } from '@modules/sales/services/ListSaleService';
import { ISalesRepositories } from '@modules/sales/domains/repositories/ISalesRepositories';

describe('ListSaleService', () => {
  let listSaleService: ListSaleService;
  let salesRepositoriesMock: ISalesRepositories;

  beforeEach(() => {
    salesRepositoriesMock = {
      list: jest.fn(),
    } as unknown as ISalesRepositories;

    container.registerInstance('salesRepositories', salesRepositoriesMock);

    listSaleService = container.resolve(ListSaleService);
  });

  it('deve retornar uma lista de vendas', async () => {
    const salesMock = [
      { id: 1, order_id: 1, products: [] },
      { id: 2, order_id: 2, products: [] },
    ];
    (salesRepositoriesMock.list as jest.Mock).mockResolvedValue(salesMock);

    const sales = await listSaleService.execute();

    expect(sales).toEqual(salesMock);
    expect(salesRepositoriesMock.list).toHaveBeenCalled();
  });
});
