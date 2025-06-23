import { ShowOrderService } from '@modules/orders/services/ShowOrderService';
import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('ShowOrderService', () => {
  let showOrderService: ShowOrderService;
  let ordersRepositoriesMock: IOrderRepositories;

  beforeEach(() => {
    ordersRepositoriesMock = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as IOrderRepositories;

    container.registerInstance('orderRepositories', ordersRepositoriesMock);

    showOrderService = container.resolve(ShowOrderService);
  });

  it('deve retornar um pedido pelo id', async () => {
    const mockOrder = { id: 1, customer_id: '1' };
    (ordersRepositoriesMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    const order = await showOrderService.execute(1);

    expect(order).toEqual(mockOrder);
    expect(ordersRepositoriesMock.findById).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro se o pedido não for encontrado', async () => {
    (ordersRepositoriesMock.findById as jest.Mock).mockResolvedValue(null);

    await expect(showOrderService.execute(999)).rejects.toThrow('Pedido não encontrado');
    expect(ordersRepositoriesMock.findById).toHaveBeenCalledWith(999);
  });
});
