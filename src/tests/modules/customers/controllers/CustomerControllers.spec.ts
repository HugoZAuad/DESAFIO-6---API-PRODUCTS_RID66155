import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';
import ListCustomerService from '@modules/customers/services/ListCustomerService';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import { Application } from 'express';

jest.mock('@modules/customers/services/CreateCustomerService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/customers/services/DeleteCustomerService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/customers/services/ListCustomerService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/customers/services/ShowCustomerService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/customers/services/UpdateCustomerService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});

describe('CustomerControllers', () => {
  let createCustomerServiceMock: jest.Mocked<CreateCustomerService>;
  let deleteCustomerServiceMock: jest.Mocked<DeleteCustomerService>;
  let listCustomerServiceMock: jest.Mocked<ListCustomerService>;
  let showCustomerServiceMock: jest.Mocked<ShowCustomerService>;
  let updateCustomerServiceMock: jest.Mocked<UpdateCustomerService>;
  let app: Application;

  beforeAll(async () => {
    createCustomerServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<CreateCustomerService>;
    deleteCustomerServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<DeleteCustomerService>;
    listCustomerServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ListCustomerService>;
    showCustomerServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ShowCustomerService>;
    updateCustomerServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<UpdateCustomerService>;

    jest.spyOn(container, 'resolve').mockImplementation((service) => {
      if (service === CreateCustomerService) return createCustomerServiceMock;
      if (service === DeleteCustomerService) return deleteCustomerServiceMock;
      if (service === ListCustomerService) return listCustomerServiceMock;
      if (service === ShowCustomerService) return showCustomerServiceMock;
      if (service === UpdateCustomerService) return updateCustomerServiceMock;
      return null;
    });

    app = await startServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /customers - deve listar clientes', async () => {
    listCustomerServiceMock.execute.mockResolvedValue({
      data: [{ id: 1, name: 'Cliente 1', email: 'cliente1@example.com', created_at: new Date(), updated_at: new Date() }],
      total: 1,
      per_page: 10,
      current_Page: 1,
      total_pages: 1,
      next_page: null,
      prev_page: null,
    });

    const response = await request(app).get('/customers').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(listCustomerServiceMock.execute).toHaveBeenCalledWith(1, 10);
  });

  it('GET /customers/:id - deve retornar cliente pelo id', async () => {
    showCustomerServiceMock.execute.mockResolvedValue({ id: 1, name: 'Cliente 1', email: 'cliente1@example.com', created_at: new Date(), updated_at: new Date() });

    const response = await request(app).get('/customers/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(showCustomerServiceMock.execute).toHaveBeenCalledWith({ id: 1 });
  });

  it('POST /customers - deve criar cliente', async () => {
    createCustomerServiceMock.execute.mockResolvedValue({ id: 1, name: 'Cliente 1', email: 'cliente1@example.com', created_at: new Date(), updated_at: new Date() });

    const response = await request(app)
      .post('/customers')
      .send({ name: 'Cliente 1', email: 'cliente1@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(createCustomerServiceMock.execute).toHaveBeenCalledWith({ name: 'Cliente 1', email: 'cliente1@example.com' });
  });

  it('PUT /customers/:id - deve atualizar cliente', async () => {
    updateCustomerServiceMock.execute.mockResolvedValue({ id: 1, name: 'Cliente Atualizado', email: 'cliente@atualizado.com', created_at: new Date(), updated_at: new Date() });

    const response = await request(app)
      .put('/customers/1')
      .send({ name: 'Cliente Atualizado', email: 'cliente@atualizado.com' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Cliente Atualizado');
    expect(updateCustomerServiceMock.execute).toHaveBeenCalledWith({ id: 1, name: 'Cliente Atualizado', email: 'cliente@atualizado.com' });
  });

  it('DELETE /customers/:id - deve deletar cliente', async () => {
    deleteCustomerServiceMock.execute.mockResolvedValue();

    const response = await request(app).delete('/customers/1');

    expect(response.status).toBe(204);
    expect(deleteCustomerServiceMock.execute).toHaveBeenCalledWith({ id: 1 });
  });
});
