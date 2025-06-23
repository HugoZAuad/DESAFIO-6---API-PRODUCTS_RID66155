import CreateProductService from '@modules/products/services/CreateProductService';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('CreateProductService', () => {
  let createProductService: CreateProductService;
  let productsRepositoriesMock: IProductRepositories;

  beforeEach(() => {
    productsRepositoriesMock = {
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
    } as unknown as IProductRepositories;

    container.registerInstance('productRepositories', productsRepositoriesMock);

    createProductService = container.resolve(CreateProductService);
  });

  it('deve lançar erro se o nome do produto já estiver cadastrado', async () => {
    (productsRepositoriesMock.findByName as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(createProductService.execute({ name: 'Produto A', price: 10, quantity: 5 })).rejects.toThrow('Já existe um produto com esse nome');
  });

  it('deve criar um novo produto com sucesso', async () => {
    (productsRepositoriesMock.findByName as jest.Mock).mockResolvedValue(null);
    (productsRepositoriesMock.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Produto A', price: 10, quantity: 5 });

    const product = await createProductService.execute({ name: 'Produto A', price: 10, quantity: 5 });

    expect(product).toHaveProperty('id');
    expect(productsRepositoriesMock.create).toHaveBeenCalledWith({ name: 'Produto A', price: 10, quantity: 5 });
  });
});
