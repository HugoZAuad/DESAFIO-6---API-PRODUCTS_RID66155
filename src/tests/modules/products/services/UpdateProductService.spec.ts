import UpdateProductService from '@modules/products/services/UpdateProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { container } from 'tsyringe';
import { SyncStockWithProductService } from '@modules/stock/services/SyncStockWithProductService';
import 'reflect-metadata';

describe('UpdateProductService', () => {
  let updateProductService: UpdateProductService;
  let productsRepositoriesMock: IProductRepositories;
  let syncStockWithProductServiceMock: SyncStockWithProductService;

  beforeEach(() => {
    productsRepositoriesMock = {
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as IProductRepositories;

    syncStockWithProductServiceMock = {
      execute: jest.fn(),
    } as unknown as SyncStockWithProductService;

    container.registerInstance('productRepositories', productsRepositoriesMock);
    container.registerInstance('SyncStockWithProductService', syncStockWithProductServiceMock);

    updateProductService = container.resolve(UpdateProductService);
  });

  it('deve lançar erro se o produto não for encontrado', async () => {
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(null);

    await expect(updateProductService.execute({ id: 1, name: 'Produto', price: 10, quantity: 5 })).rejects.toThrow('Produto não encontrado');
  });

  it('deve lançar erro se já existir um produto com o mesmo nome', async () => {
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: 1, name: 'Produto', price: 10, quantity: 5 });
    productsRepositoriesMock.findByName = jest.fn().mockResolvedValue({ id: 2, name: 'Produto', price: 10, quantity: 5 });

    await expect(updateProductService.execute({ id: 1, name: 'Produto', price: 10, quantity: 5 })).rejects.toThrow('Já existe um produto com esse nome');
  });

  it('deve atualizar o produto e sincronizar o estoque com sucesso', async () => {
    const product = { id: 1, name: 'Produto', price: 10, quantity: 5 };
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(product);
    productsRepositoriesMock.findByName = jest.fn().mockResolvedValue(null);
    productsRepositoriesMock.save = jest.fn().mockResolvedValue(product);
    syncStockWithProductServiceMock.execute = jest.fn().mockResolvedValue(undefined);

    const result = await updateProductService.execute({ id: 1, name: 'Produto Atualizado', price: 20, quantity: 10 });

    expect(productsRepositoriesMock.save).toHaveBeenCalled();
    expect(syncStockWithProductServiceMock.execute).toHaveBeenCalledWith(product);
    expect(result.name).toBe('Produto Atualizado');
    expect(result.price).toBe(20);
    expect(result.quantity).toBe(10);
  });
});
