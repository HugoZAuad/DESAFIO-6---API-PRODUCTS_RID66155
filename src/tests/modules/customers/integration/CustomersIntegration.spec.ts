import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { Application } from 'express';

describe('Customers Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await startServer();
  });

  it('should create a new customer successfully', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        name: 'Integration Test Customer',
        email: 'integration@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should list customers with pagination', async () => {
    const response = await request(app)
      .get('/customers')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a customer by id', async () => {
    // First create a customer to get its id
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Integration Test Customer',
        email: 'integration@example.com',
      });

    const customerId = createResponse.body.id;

    const response = await request(app).get(`/customers/${customerId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', customerId);
  });

  it('should update a customer successfully', async () => {
    // First create a customer to update
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Integration Test Customer',
        email: 'integration@example.com',
      });

    const customerId = createResponse.body.id;

    const response = await request(app)
      .put(`/customers/${customerId}`)
      .send({
        name: 'Updated Customer',
        email: 'updated@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Customer');
    expect(response.body.email).toBe('updated@example.com');
  });

  it('should delete a customer successfully', async () => {
    // First create a customer to delete
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Integration Test Customer',
        email: 'integration@example.com',
      });

    const customerId = createResponse.body.id;

    const response = await request(app).delete(`/customers/${customerId}`);

    expect(response.status).toBe(204);
  });
});
