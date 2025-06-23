import { SyncStockWithProductService } from '@modules/stock/services/SyncStockWithProductService';
import { StockMovementType } from '@modules/stock/infra/database/entities/Stock';

describe('SyncStockWithProductService', () => {
  let syncStockWithProductService: SyncStockWithProductService;
  let stockRepositoriesMock: jest.Mocked<import('@modules/stock/domains/repositories/IStockRepositories').IStockRepositories>;

  beforeEach(() => {
    stockRepositoriesMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProductId: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<import('@modules/stock/domains/repositories/IStockRepositories').IStockRepositories>;
    syncStockWithProductService = new SyncStockWithProductService(stockRepositoriesMock);
  });

  it('should update existing stock if found', async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      quantity: 5,
      order_products: [],
      price: 10,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const existingStock = { 
      id: 1, 
      product: {
        id: 1,
        name: 'Old Product',
        price: 50,
        quantity: 3,
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
      product_name: 'Old Product', 
      quantity: 3, 
      movement_type: StockMovementType.IN,
      created_at: new Date(),
      updated_at: new Date(),
    };

    stockRepositoriesMock.findByProductId.mockResolvedValue(existingStock);
    stockRepositoriesMock.update.mockResolvedValue(null as unknown as import('@modules/stock/domains/interfaces/IStock').IStock);

    await syncStockWithProductService.execute(product);

    expect(stockRepositoriesMock.findByProductId).toHaveBeenCalledWith(product.id);
    expect(stockRepositoriesMock.update).toHaveBeenCalledWith(expect.objectContaining({
      id: existingStock.id,
      product_name: product.name,
      quantity: product.quantity,
    }));
    expect(stockRepositoriesMock.create).not.toHaveBeenCalled();
  });

  it('should create new stock if none exists', async () => {
    const product = {
      id: 2,
      name: 'Product 2',
      quantity: 10,
      order_products: [],
      price: 20,
      created_at: new Date(),
      updated_at: new Date(),
    };

    stockRepositoriesMock.findByProductId.mockResolvedValue(null);
    stockRepositoriesMock.create.mockResolvedValue(null as unknown as import('@modules/stock/domains/interfaces/IStock').IStock);

    await syncStockWithProductService.execute(product);

    expect(stockRepositoriesMock.findByProductId).toHaveBeenCalledWith(product.id);
    expect(stockRepositoriesMock.create).toHaveBeenCalledWith(expect.objectContaining({
      product: { id: product.id },
      product_name: product.name,
      quantity: product.quantity,
    }));
    expect(stockRepositoriesMock.update).not.toHaveBeenCalled();
  });
});
