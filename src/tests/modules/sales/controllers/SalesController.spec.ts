import request from 'supertest';
import { Application, Request, Response } from 'express';
import { container } from 'tsyringe';
import { SalesController } from '@modules/sales/infra/http/controllers/SalesController';
import 'reflect-metadata';

jest.mock('@modules/sales/services/CreateSaleService', () => {
  return {
    CreateSaleService: jest.fn().mockImplementation(() => {
      return { execute: jest.fn() };
    }),
  };
});

jest.mock('@modules/sales/services/ListSaleService', () => {
  return {
    ListSaleService: jest.fn().mockImplementation(() => {
      return { execute: jest.fn() };
    }),
  };
});

import { CreateSaleService } from '@modules/sales/services/CreateSaleService';
import { ListSaleService } from '@modules/sales/services/ListSaleService';

describe('SalesController', () => {
  let createSaleServiceMock: jest.Mocked<CreateSaleService>;
  let listSaleServiceMock: jest.Mocked<ListSaleService>;
  let salesController: SalesController;
  let app: Application;

  beforeAll(async () => {
    createSaleServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<CreateSaleService>;
    listSaleServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ListSaleService>;

    jest.spyOn(container, 'resolve').mockImplementation((service) => {
      if (service === CreateSaleService) return createSaleServiceMock;
      if (service === ListSaleService) return listSaleServiceMock;
      return null;
    });

    salesController = new SalesController();

    const startServer = (await import('@shared/infra/http/server')).default;
    app = await startServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('list deve retornar lista de vendas', async () => {
    listSaleServiceMock.execute.mockResolvedValue([{
      id: 1,
      order: {
        id: 1,
        customer: {
          id: 1,
          name: 'Customer 1',
          email: 'customer1@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
      sale_stocks: [],
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    const response = await request(app).get('/sales');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(listSaleServiceMock.execute).toHaveBeenCalled();
  });

  it('create deve criar uma venda com sucesso', async () => {
    createSaleServiceMock.execute.mockResolvedValue({
      id: 1,
      order: {
        id: 1,
        customer: {
          id: 1,
          name: 'Customer 1',
          email: 'customer1@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
      sale_stocks: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app)
      .post('/sales')
      .send({ order_id: 1, products: [{ stock_id: 1, quantity: 1 }] });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(createSaleServiceMock.execute).toHaveBeenCalledWith({ order_id: 1, products: [{ stock_id: 1, quantity: 1 }] });
  });

  it('create deve retornar erro de validação', async () => {
    const next = jest.fn();
    const req = {
      body: {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await salesController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'order_id é obrigatório' });
  });
});
