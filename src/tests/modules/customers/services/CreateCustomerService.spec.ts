import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('CreateCustomerService', () => {
  let createCustomerService: CreateCustomerService;
  let customersRepositoriesMock: ICustomerRepositories;

  beforeEach(() => {
    customersRepositoriesMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findAndCount: jest.fn(),
      findByName: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('customerRepositories', customersRepositoriesMock);

    createCustomerService = container.resolve(CreateCustomerService);
  });

  it('deve lançar erro se o email do cliente já estiver cadastrado', async () => {
    (customersRepositoriesMock.findByEmail as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(createCustomerService.execute({ name: 'Cliente A', email: 'cliente@example.com' })).rejects.toThrow('O endereço de e-mail já esta sendo usado');
  });

  it('deve criar um novo cliente com sucesso', async () => {
    (customersRepositoriesMock.findByEmail as jest.Mock).mockResolvedValue(null);
    (customersRepositoriesMock.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Cliente A', email: 'cliente@example.com' });

    const customer = await createCustomerService.execute({ name: 'Cliente A', email: 'cliente@example.com' });

    expect(customer).toHaveProperty('id');
    expect(customersRepositoriesMock.create).toHaveBeenCalledWith({ name: 'Cliente A', email: 'cliente@example.com' });
  });
});
