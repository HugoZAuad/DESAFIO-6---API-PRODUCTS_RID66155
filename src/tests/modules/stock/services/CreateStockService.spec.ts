import { CreateStockService } from '@modules/stock/services/CreateStockService';
import { ICreateStock } from '@modules/stock/domains/interfaces/ICreateStock';
import { StockMovementType } from '@modules/stock/infra/database/entities/Stock';
import { IStockRepositories } from '@modules/stock/domains/repositories/IStockRepositories';

describe('CreateStockService', () => {
  let createStockService: CreateStockService;
  let stockRepositoriesMock: jest.Mocked<IStockRepositories>;

  beforeEach(() => {
    stockRepositoriesMock = {
      create: jest.fn(),
      findByProductId: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IStockRepositories>;
    createStockService = new CreateStockService(stockRepositoriesMock);
  });

  it('should call stockRepositories.create with correct data and return the result', async () => {
    const stockData: ICreateStock = { product: { id: 1 }, quantity: 10, movement_type: StockMovementType.IN };
    const createdStock = { 
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
      movement_type: StockMovementType.IN,
      created_at: new Date(), 
      updated_at: new Date() 
    };

    stockRepositoriesMock.create.mockResolvedValue(createdStock);

    const result = await createStockService.execute(stockData);

    expect(stockRepositoriesMock.create).toHaveBeenCalledWith(stockData);
    expect(result).toEqual(createdStock);
  });
});
