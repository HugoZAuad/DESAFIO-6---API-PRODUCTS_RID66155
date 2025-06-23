import { CreateOrderService } from '@modules/orders/services/CreateOrderService';
import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories';
import { IProductRepositories } from '@modules/products/domains/repositories/ICreateProductRepositories';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('CreateOrderService', () => {
  let createOrderService: CreateOrderService;
  let ordersRepositoriesMock: IOrderRepositories;
  let productsRepositoriesMock: IProductRepositories;
  let customersRepositoriesMock: ICustomerRepositories;

  const validOrder = {
    customer_id: '1',
    order_products: [{ product_id: '1', quantity: 1, price: 10 }],
  };

  beforeEach(() => {
    ordersRepositoriesMock = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as IOrderRepositories;

    productsRepositoriesMock = {
      findAllByIds: jest.fn(),
      save: jest.fn(),
    } as unknown as IProductRepositories;

    customersRepositoriesMock = {
      findById: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('orderRepositories', ordersRepositoriesMock);
    container.registerInstance('productRepositories', productsRepositoriesMock);
    container.registerInstance('customerRepositories', customersRepositoriesMock);

    createOrderService = container.resolve(CreateOrderService);
  });

  it('deve lançar erro se customer_id estiver ausente', async () => {
    await expect(createOrderService.execute({ customer_id: '', order_products: [] })).rejects.toThrow('customer_id é obrigatório para criar um pedido');
  });

  it('deve lançar erro se o cliente não existir', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(null);
    await expect(createOrderService.execute(validOrder)).rejects.toThrow('O cliente não foi localizado');
  });

  it('deve lançar erro se produtos não forem encontrados', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: '1' });
    productsRepositoriesMock.findAllByIds = jest.fn().mockResolvedValue([]);
    await expect(createOrderService.execute(validOrder)).rejects.toThrow('Não foi possivel encontrar os produtos solicitados');
  });

  it('deve lançar erro se algum produto for inexistente', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: '1' });
    productsRepositoriesMock.findAllByIds = jest.fn().mockResolvedValue([{ id: 1 }]);
    const orderWithInexistentProduct = {
      customer_id: '1',
      order_products: [{ product_id: '2', quantity: 1, price: 10 }],
    };
    await expect(createOrderService.execute(orderWithInexistentProduct)).rejects.toThrow('Produto 2 não encontrado');
  });

  it('deve lançar erro se quantidade do produto for insuficiente', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: '1' });
    productsRepositoriesMock.findAllByIds = jest.fn().mockResolvedValue([{ id: 1, quantity: 1, name: 'Product 1', price: 10 }]);
    const orderWithInsufficientQuantity = {
      customer_id: '1',
      order_products: [{ product_id: '1', quantity: 2, price: 10 }],
    };
    await expect(createOrderService.execute(orderWithInsufficientQuantity)).rejects.toThrow('A quantidade não está disponivel para o produto');
  });

  it('deve criar um novo pedido com sucesso', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: '1' });
    productsRepositoriesMock.findAllByIds = jest.fn().mockResolvedValue([{ id: 1, quantity: 5, name: 'Product 1', price: 10 }]);
    ordersRepositoriesMock.create = jest.fn().mockResolvedValue({
      id: 1,
      customer_id: '1',
      order_products: [{ product_id: '1', quantity: 2, price: 10 }],
    });
    await createOrderService.execute({
      customer_id: '1',
      order_products: [{ product_id: '1', quantity: 2, price: 10 }],
    });
    expect(ordersRepositoriesMock.create).toHaveBeenCalledWith({
      customer_id: '1',
      customer: { id: '1' },
      order_products: [{ product_id: '1', quantity: 2, price: 10 }],
    });
    expect(productsRepositoriesMock.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      quantity: 3,
    }));
  });
});