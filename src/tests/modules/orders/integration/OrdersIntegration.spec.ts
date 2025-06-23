import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { Application } from 'express';

describe('Orders Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await startServer();
  });

  it('should create a new order successfully', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        customer: {
          id: 1,
          name: 'Integration Test Customer',
          email: 'integration@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should list orders with pagination', async () => {
    const response = await request(app)
      .get('/orders')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get an order by id', async () => {
    // First create an order to get its id
    const createResponse = await request(app)
      .post('/orders')
      .send({
        customer: {
          id: 1,
          name: 'Integration Test Customer',
          email: 'integration@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        order_products: [],
      });

    const orderId = createResponse.body.id;

    const response = await request(app).get(`/orders/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', orderId);
  });

  it('should return 404 for non-existent order', async () => {
    const response = await request(app).get('/orders/999999');

    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid create order request', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        customer: null,
        order_products: [],
      });

    expect(response.status).toBe(400);
  });
});
