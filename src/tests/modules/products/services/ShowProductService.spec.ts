import ShowProductService from '@modules/products/services/ShowProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('ShowProductService', () => {
  let showProductService: ShowProductService;
  let productsRepositoriesMock: IProductRepositories;

  beforeEach(() => {
    productsRepositoriesMock = {
      findById: jest.fn(),
    } as unknown as IProductRepositories;

    container.registerInstance('productRepositories', productsRepositoriesMock);

    showProductService = container.resolve(ShowProductService);
  });

  it('deve retornar produto pelo id', async () => {
    const product = { id: 1, name: 'Produto Teste', price: 10, quantity: 5 };
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(product);

    const result = await showProductService.execute({ id: 1 });

    expect(result).toEqual(product);
  });

  it('deve lançar erro se produto não for encontrado', async () => {
    productsRepositoriesMock.findById = jest.fn().mockResolvedValue(null);

    await expect(showProductService.execute({ id: 1 })).rejects.toThrow('Produtos não encontrados');
  });
});
