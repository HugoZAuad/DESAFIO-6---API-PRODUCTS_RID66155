import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { Application } from 'express';

describe('Stock Module Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await startServer();
  });

  it('GET /stock - should return list of stocks', async () => {
    const response = await request(app).get('/stock');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
