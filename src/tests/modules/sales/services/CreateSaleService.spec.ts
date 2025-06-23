import { CreateSaleService } from '@modules/sales/services/CreateSaleService';
import { ISalesRepositories } from '@modules/sales/domains/repositories/ISalesRepositories';
import { IStockRepositories } from '@modules/stock/domains/repositories/IStockRepositories';
import { StockMovementType } from '@modules/stock/infra/database/entities/Stock';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('CreateSaleService', () => {
  let createSaleService: CreateSaleService;
  let salesRepositoriesMock: ISalesRepositories;
  let stockRepositoriesMock: IStockRepositories;

  beforeEach(() => {
    salesRepositoriesMock = {
      checkOrderExists: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
    } as unknown as ISalesRepositories;

    stockRepositoriesMock = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      findByProductId: jest.fn(),
    } as unknown as IStockRepositories;

    container.registerInstance('salesRepositories', salesRepositoriesMock);
    container.registerInstance('stockRepositories', stockRepositoriesMock);

    createSaleService = container.resolve(CreateSaleService);
  });

  it('deve lançar erro se order_id estiver ausente', async () => {
    await expect(createSaleService.execute({} as unknown as { order_id?: number; products: { stock_id: number; quantity: number }[] })).rejects.toThrow('order_id é obrigatório para criar uma venda');
  });

  it('deve lançar erro se o array de produtos estiver vazio', async () => {
    await expect(createSaleService.execute({ order_id: 1, products: [] })).rejects.toThrow('Nenhum produto informado para a venda');
  });

  it('deve lançar erro se o pedido não existir', async () => {
    (salesRepositoriesMock.checkOrderExists as jest.Mock).mockResolvedValue(false);
    await expect(createSaleService.execute({ order_id: 1, products: [{ stock_id: 1, quantity: 1 }] })).rejects.toThrow('Pedido (order) não encontrado');
  });

  it('deve lançar erro se o produto na venda for inválido', async () => {
    (salesRepositoriesMock.checkOrderExists as jest.Mock).mockResolvedValue(true);
    await expect(createSaleService.execute({ order_id: 1, products: [{ stock_id: 0, quantity: 1 }] })).rejects.toThrow('Produto inválido na venda');
  });

  it('deve lançar erro se o estoque não existir', async () => {
    (salesRepositoriesMock.checkOrderExists as jest.Mock).mockResolvedValue(true);
    (stockRepositoriesMock.findById as jest.Mock).mockResolvedValue(null);
    await expect(createSaleService.execute({ order_id: 1, products: [{ stock_id: 1, quantity: 1 }] })).rejects.toThrow('Estoque com id 1 não encontrado');
  });

  it('deve lançar erro se a quantidade no estoque for insuficiente', async () => {
    (salesRepositoriesMock.checkOrderExists as jest.Mock).mockResolvedValue(true);
    (stockRepositoriesMock.findById as jest.Mock).mockResolvedValue({
      id: 1,
      quantity: 0,
      product: { id: 1, name: 'Product A' },
    });
    await expect(createSaleService.execute({ order_id: 1, products: [{ stock_id: 1, quantity: 1 }] })).rejects.toThrow('Quantidade insuficiente no estoque para o produto com stock_id 1');
  });

  it('deve criar venda e atualizar estoque corretamente', async () => {
    (salesRepositoriesMock.checkOrderExists as jest.Mock).mockResolvedValue(true);
    (salesRepositoriesMock.create as jest.Mock).mockResolvedValue({ id: 1, order: { id: 1 }, products: [] });
    (stockRepositoriesMock.findById as jest.Mock).mockResolvedValue({
      id: 1,
      quantity: 10,
      product: { id: 1, name: 'Product A' },
    });
    (stockRepositoriesMock.create as jest.Mock).mockResolvedValue({});
    (stockRepositoriesMock.update as jest.Mock).mockResolvedValue({});

    const sale = await createSaleService.execute({
      order_id: 1,
      products: [{ stock_id: 1, quantity: 2 }],
    });

    expect(sale).toHaveProperty('id');
    expect(stockRepositoriesMock.create).toHaveBeenCalledWith(expect.objectContaining({
      product: expect.any(Object),
      product_name: 'Product A',
      quantity: 2,
      movement_type: StockMovementType.OUT,
    }));
    expect(stockRepositoriesMock.update).toHaveBeenCalled();
  });
});