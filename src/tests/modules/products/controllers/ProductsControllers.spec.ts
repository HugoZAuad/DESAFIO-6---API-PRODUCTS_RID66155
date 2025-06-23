import request from 'supertest';
import startServer from '@shared/infra/http/server';
import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import ListProductService from '@modules/products/services/ListProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import { Application } from 'express';

jest.mock('@modules/products/services/CreateProductService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/products/services/DeleteProductService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/products/services/ListProductService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/products/services/ShowProductService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});
jest.mock('@modules/products/services/UpdateProductService', () => {
  return jest.fn().mockImplementation(() => {
    return { execute: jest.fn() };
  });
});

describe('ProductsControllers', () => {
  let createProductServiceMock: jest.Mocked<CreateProductService>;
  let deleteProductServiceMock: jest.Mocked<DeleteProductService>;
  let listProductServiceMock: jest.Mocked<ListProductService>;
  let showProductServiceMock: jest.Mocked<ShowProductService>;
  let updateProductServiceMock: jest.Mocked<UpdateProductService>;
  let app: Application;

  beforeAll(async () => {
    createProductServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<CreateProductService>;
    deleteProductServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<DeleteProductService>;
    listProductServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ListProductService>;
    showProductServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<ShowProductService>;
    updateProductServiceMock = { execute: jest.fn() } as unknown as jest.Mocked<UpdateProductService>;

    jest.spyOn(container, 'resolve').mockImplementation((service) => {
      if (service === CreateProductService) return createProductServiceMock;
      if (service === DeleteProductService) return deleteProductServiceMock;
      if (service === ListProductService) return listProductServiceMock;
      if (service === ShowProductService) return showProductServiceMock;
      if (service === UpdateProductService) return updateProductServiceMock;
      return null;
    });

    app = await startServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /products - deve listar produtos', async () => {
    listProductServiceMock.execute.mockResolvedValue({
      data: [{ id: 1, name: 'Produto 1', price: 10, quantity: 5, order_products: [], created_at: new Date(), updated_at: new Date() }],
      total: 1,
      per_page: 10,
      current_Page: 1,
      total_pages: 1,
      next_page: null,
      prev_page: null,
    });

    const response = await request(app).get('/products').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(listProductServiceMock.execute).toHaveBeenCalledWith(1, 10);
  });

  it('GET /products/:id - deve retornar produto pelo id', async () => {
    showProductServiceMock.execute.mockResolvedValue({ id: 1, name: 'Produto 1', price: 10, quantity: 5, order_products: [], created_at: new Date(), updated_at: new Date() });

    const response = await request(app).get('/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(showProductServiceMock.execute).toHaveBeenCalledWith({ id: 1 });
  });

  it('POST /products - deve criar produto', async () => {
    createProductServiceMock.execute.mockResolvedValue({ id: 1, name: 'Produto 1', price: 10, quantity: 5, order_products: [], created_at: new Date(), updated_at: new Date() });

    const response = await request(app)
      .post('/products')
      .send({ name: 'Produto 1', price: 10, quantity: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(createProductServiceMock.execute).toHaveBeenCalledWith({ name: 'Produto 1', price: 10, quantity: 5 });
  });

  it('PUT /products/:id - deve atualizar produto', async () => {
    updateProductServiceMock.execute.mockResolvedValue({ id: 1, name: 'Produto Atualizado', price: 20, quantity: 10, order_products: [], created_at: new Date(), updated_at: new Date() });

    const response = await request(app)
      .put('/products/1')
      .send({ name: 'Produto Atualizado', price: 20, quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Produto Atualizado');
    expect(updateProductServiceMock.execute).toHaveBeenCalledWith({ id: 1, name: 'Produto Atualizado', price: 20, quantity: 10 });
  });

  it('DELETE /products/:id - deve deletar produto', async () => {
    deleteProductServiceMock.execute.mockResolvedValue();

    const response = await request(app).delete('/products/1');

    expect(response.status).toBe(204);
    expect(deleteProductServiceMock.execute).toHaveBeenCalledWith({ id: 1 });
  });
});
