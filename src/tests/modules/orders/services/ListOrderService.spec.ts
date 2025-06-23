import ListOrderService from '@modules/orders/services/ListOrderService'
import { IOrderRepositories } from '@modules/orders/domains/repositories/ICreateOrderRepositories'
import { container } from 'tsyringe'
import 'reflect-metadata'

describe('ListOrderService', () => {
  let listOrderService: ListOrderService
  let ordersRepositoriesMock: IOrderRepositories

  beforeEach(() => {
    ordersRepositoriesMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as IOrderRepositories

    container.registerInstance('ordersRepository', ordersRepositoriesMock)

    listOrderService = container.resolve(ListOrderService)
  })

  it('deve retornar uma lista de pedidos', async () => {
    const mockOrders = [
      { id: 1, customer_id: '1' },
      { id: 2, customer_id: '2' },
    ];
    (ordersRepositoriesMock.findAll as jest.Mock).mockResolvedValue(mockOrders)

    const orders = await listOrderService.execute({ page: 1, limit: 10 })

    expect(orders).toEqual(mockOrders)
    expect(ordersRepositoriesMock.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 })
  })

  it('deve retornar lista vazia se não houver pedidos', async () => {
    (ordersRepositoriesMock.findAll as jest.Mock).mockResolvedValue([])
    const orders = await listOrderService.execute({ page: 1, limit: 10 })
    expect(orders).toEqual([]) 
    expect(ordersRepositoriesMock.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 })
  })
})
