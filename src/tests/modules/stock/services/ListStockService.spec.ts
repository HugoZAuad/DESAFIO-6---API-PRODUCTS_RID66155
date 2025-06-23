import { ListStockService } from '@modules/stock/services/ListStockService';
import { IStockRepositories } from '@modules/stock/domains/repositories/IStockRepositories';

describe('ListStockService', () => {
  let listStockService: ListStockService;
  let stockRepositoriesMock: jest.Mocked<IStockRepositories>;

  beforeEach(() => {
    stockRepositoriesMock = {
      create: jest.fn(),
      findByProductId: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IStockRepositories>;
    listStockService = new ListStockService(stockRepositoriesMock);
  });

  it('should call stockRepositories.list and return the result', async () => {
    const stocks = [{
      id: 1,
      product: {
        id: 1,
        name: 'Test Product',
        price: 100,
        quantity: 10,
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
      product_id: 1,
      product_name: 'Test Product',
      quantity: 10,
      movement_type: 1 as unknown as import('@modules/stock/infra/database/entities/Stock').StockMovementType,
      created_at: new Date(),
      updated_at: new Date(),
    }];

    stockRepositoriesMock.list.mockResolvedValue(stocks);

    const result = await listStockService.execute();

    expect(stockRepositoriesMock.list).toHaveBeenCalled();
    expect(result).toEqual(stocks);
  });
});
