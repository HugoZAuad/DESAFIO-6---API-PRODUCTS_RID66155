import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { Application } from 'express';

describe('Products Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await startServer();
  });

  it('deve criar um novo produto com sucesso', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Integration Test Product',
        price: 100,
        quantity: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('deve listar produtos com paginação', async () => {
    const response = await request(app)
      .get('/products')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('deve obter um produto por id', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({
        name: 'Integration Test Product',
        price: 100,
        quantity: 10,
      });

    const productId = createResponse.body.id;

    const response = await request(app).get(`/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
  });

  it('deve atualizar um produto com sucesso', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({
        name: 'Integration Test Product',
        price: 100,
        quantity: 10,
      });

    const productId = createResponse.body.id;

    const response = await request(app)
      .put(`/products/${productId}`)
      .send({
        name: 'Updated Product',
        price: 150,
        quantity: 20,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product');
    expect(response.body.price).toBe(150);
    expect(response.body.quantity).toBe(20);
  });

  it('deve excluir um produto com sucesso', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({
        name: 'Integration Test Product',
        price: 100,
        quantity: 10,
      });

    const productId = createResponse.body.id;

    const response = await request(app).delete(`/products/${productId}`);

    expect(response.status).toBe(204);
  });
});
