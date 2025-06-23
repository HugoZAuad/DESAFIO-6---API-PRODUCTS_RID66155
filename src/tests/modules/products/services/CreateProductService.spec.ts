import CreateProductService from '@modules/products/services/CreateProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { SyncStockWithProductService } from '@modules/stock/services/SyncStockWithProductService';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('CreateProductService', () => {
  let createProductService: CreateProductService;
  let productsRepositoriesMock: IProductRepositories;
  let syncStockWithProductServiceMock: SyncStockWithProductService;

  beforeEach(() => {
    productsRepositoriesMock = {
      findByName: jest.fn(),
      create: jest.fn(),
    } as unknown as IProductRepositories;

    syncStockWithProductServiceMock = {
      execute: jest.fn(),
    } as unknown as SyncStockWithProductService;

    container.registerInstance('productRepositories', productsRepositoriesMock);
    container.registerInstance('SyncStockWithProductService', syncStockWithProductServiceMock);

    createProductService = container.resolve(CreateProductService);
  });

  it('deve lançar erro se o nome do produto já estiver cadastrado', async () => {
    productsRepositoriesMock.findByName = jest.fn().mockResolvedValue(true); 

    await expect(createProductService.execute({ name: 'Produto', price: 10, quantity: 5 })).rejects.toThrow('Já existe um produto com esse nome');
  });

  it('deve criar um novo produto com sucesso', async () => {
    productsRepositoriesMock.findByName = jest.fn().mockResolvedValue(null); 
    productsRepositoriesMock.create = jest.fn().mockResolvedValue({ id: 1, name: 'Produto', price: 10, quantity: 5 });

    const result = await createProductService.execute({ name: 'Produto', price: 10, quantity: 5 });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Produto');
  });
});
