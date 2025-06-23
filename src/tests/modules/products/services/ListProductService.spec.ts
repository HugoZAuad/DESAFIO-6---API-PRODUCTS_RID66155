import ListProductService from '@modules/products/services/ListProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('ListProductService', () => {
  let listProductService: ListProductService;
  let productsRepositoriesMock: IProductRepositories;

  beforeEach(() => {
    productsRepositoriesMock = {
      findAndCount: jest.fn(),
    } as unknown as IProductRepositories;

    container.registerInstance('productRepositories', productsRepositoriesMock);

    listProductService = container.resolve(ListProductService);
  });

  it('deve retornar lista paginada de produtos', async () => {
    const products = [{ id: 1, name: 'Produto 1', price: 10, quantity: 5 }];
    productsRepositoriesMock.findAndCount = jest.fn().mockResolvedValue([products, 1]);

    const result = await listProductService.execute(1, 10);

    expect(result.data).toEqual(products);
    expect(result.total).toBe(1);
    expect(result.per_page).toBe(10);
    expect(result.current_Page).toBe(1);
    expect(result.total_pages).toBe(1);
    expect(result.next_page).toBeNull();
    expect(result.prev_page).toBeNull();
  });

  it('deve lançar erro se nenhum produto for encontrado', async () => {
    productsRepositoriesMock.findAndCount = jest.fn().mockResolvedValue([[], 0]);

    await expect(listProductService.execute(1, 10)).rejects.toThrow('Produtos não encontrados');
  });
});
