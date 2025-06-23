import DeleteProductService from '@modules/products/services/DeleteProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { container } from 'tsyringe';
import { SyncStockWithProductService } from '@modules/stock/services/SyncStockWithProductService';
import 'reflect-metadata';

describe('DeleteProductService', () => {
  let deleteProductService: DeleteProductService;
  let productsRepositoriesMock: IProductRepositories;
  let syncStockWithProductServiceMock: SyncStockWithProductService;

  beforeEach(() => {
    productsRepositoriesMock = {
      findById: jest.fn(),
      remove: jest.fn(),
    } as unknown as IProductRepositories;

    syncStockWithProductServiceMock = {
      execute: jest.fn(),
    } as unknown as SyncStockWithProductService;

    container.registerInstance('productRepositories', productsRepositoriesMock);
    container.registerInstance('SyncStockWithProductService', syncStockWithProductServiceMock);

    deleteProductService = container.resolve(DeleteProductService);
  });

  it('deve lançar erro se o produto não for encontrado', async () => {
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(null);
    await expect(deleteProductService.execute({ id: 1 })).rejects.toThrow('Produto não encontrado');
  });

  it('deve deletar o produto e sincronizar o estoque com sucesso', async () => {
    const product = { id: 1, name: 'Produto Teste', price: 10, quantity: 5 };
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(product);
    productsRepositoriesMock.remove = jest.fn().mockResolvedValue(undefined);
    syncStockWithProductServiceMock.execute = jest.fn().mockResolvedValue(undefined);

    await deleteProductService.execute({ id: 1 });

    expect(productsRepositoriesMock.remove).toHaveBeenCalledWith(product);
    expect(syncStockWithProductServiceMock.execute).toHaveBeenCalledWith(product);
  });
});
