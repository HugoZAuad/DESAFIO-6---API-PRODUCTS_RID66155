import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { container } from 'tsyringe';
import { ShowOrderService } from '@modules/orders/services/ShowOrderService';
import { CreateOrderService } from '@modules/orders/services/CreateOrderService';
import ListOrderService from '@modules/orders/services/ListOrderService';
import { Application } from 'express';

jest.mock('@modules/orders/services/CreateOrderService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/orders/services/ListOrderService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/orders/services/ShowOrderService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});

describe('OrdersControllers', () => {
  let createOrderServiceMock: jest.Mocked<CreateOrderService>;
  let listOrderServiceMock: jest.Mocked<ListOrderService>;
  let showOrderServiceMock: jest.Mocked<ShowOrderService>;
  let app: Application;

  beforeAll(async () => {
    createOrderServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<CreateOrderService>;
    listOrderServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ListOrderService>;
    showOrderServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ShowOrderService>;

    jest.spyOn(container, 'resolve').mockImplementation((service) => {
      if (service === CreateOrderService) return createOrderServiceMock;
      if (service === ListOrderService) return listOrderServiceMock;
      if (service === ShowOrderService) return showOrderServiceMock;
      return null;
    });

    app = await startServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /orders - deve retornar erro se customer_id estiver ausente', async () => {
    createOrderServiceMock.execute.mockRejectedValue(new Error('customer_id é obrigatório para criar um pedido'));

    const response = await request(app)
      .post('/orders')
      .send({ customer_id: '', order_products: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('customer_id é obrigatório para criar um pedido');
  });

  it('POST /orders - deve retornar erro se cliente não existir', async () => {
    createOrderServiceMock.execute.mockRejectedValue(new Error('O cliente não foi localizado'));

    const response = await request(app)
      .post('/orders')
      .send({ customer_id: '999', order_products: [] });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('O cliente não foi localizado');
  });

  it('GET /orders - deve retornar erro se não houver pedidos', async () => {
    listOrderServiceMock.execute.mockRejectedValue(new Error('Pedidos não encontrados'));

    const response = await request(app)
      .get('/orders')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Pedidos não encontrados');
  });

  it('GET /orders/:id - deve retornar erro se pedido não for encontrado', async () => {
    showOrderServiceMock.execute.mockRejectedValue(new Error('Pedido não encontrado'));

    const response = await request(app)
      .get('/orders/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Pedido não encontrado');
  });

  it('POST /orders - deve criar um novo pedido', async () => {
    createOrderServiceMock.execute.mockResolvedValue({
      id: 1,
      customer: {
        id: 1,
        name: 'Test Customer',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      order_products: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app)
      .post('/orders')
      .send({
        customer: {
          id: 1,
          name: 'Test Customer',
          email: 'test@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(createOrderServiceMock.execute).toHaveBeenCalledWith({
      customer: {
        id: 1,
        name: 'Test Customer',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      order_products: [],
    });
  });

  it('GET /orders - deve listar pedidos', async () => {
    listOrderServiceMock.execute.mockResolvedValue([
      {
        id: 1,
        customer: {
          id: 1,
          name: 'Test Customer',
          email: 'test@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const response = await request(app).get('/orders').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        customer: {
          id: 1,
          name: 'Test Customer',
          email: 'test@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    expect(listOrderServiceMock.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('GET /orders/:id - deve retornar um pedido pelo id', async () => {
    showOrderServiceMock.execute.mockResolvedValue({
      id: 1,
      customer: {
        id: 1,
        name: 'Test Customer',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      order_products: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app).get('/orders/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(showOrderServiceMock.execute).toHaveBeenCalledWith(1);
  });
});

