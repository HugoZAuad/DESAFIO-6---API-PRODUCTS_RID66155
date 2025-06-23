import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { Application } from 'express';

describe('Testes de Integração do módulo Sales', () => {
  let app: Application;

  beforeAll(async () => {
    app = await startServer();
  });

  it('deve criar uma nova venda com sucesso', async () => {
    const response = await request(app)
      .post('/sales')
      .send({
        order_id: 1,
        products: [{ stock_id: 1, quantity: 1 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('deve listar vendas', async () => {
    const response = await request(app).get('/sales');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
